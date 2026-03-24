import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generateAppHTML, type TemplateType } from '@/lib/templates/generate-app'
import { slugify } from '@/lib/utils'
import { saveApp } from '@/lib/store/apps'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3020'

/**
 * Streaming endpoint that:
 * 1. Streams AI-written copy token by token (for real-time display)
 * 2. Generates the full HTML app
 * 3. Saves to in-memory store
 * 4. Returns final URL
 */
export async function POST(req: NextRequest) {
  const { templateType, answers } = await req.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        const rawName = answers.businessName || answers.eventName || answers.waitlistFor || answers.yourName || answers.organizationName || 'myapp'
        const subdomain = slugify(rawName) || 'myapp'

        send('status', { step: 'generating_copy', message: 'AI is writing your copy...' })

        let aiHeadline = ''
        let aiSubheadline = ''
        let aiCtaText = ''
        let aiSeoDescription = ''

        // Stream AI copy if available
        if (client) {
          const businessInfo = Object.entries(answers)
            .filter(([k, v]) => v && !k.startsWith('brand') && !k.startsWith('project'))
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')

          try {
            let buffer = ''
            const streamResponse = client.messages.stream({
              model: 'claude-haiku-4-5',
              max_tokens: 300,
              system: 'Write copy for a small business web app. Return ONLY valid JSON: {"headline":"...","subheadline":"...","ctaText":"...","seoDescription":"..."}',
              messages: [{ role: 'user', content: `${templateType.replace('_', ' ')} app:\n${businessInfo}\nReturn ONLY JSON.` }],
            })

            for await (const chunk of streamResponse) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                buffer += chunk.delta.text
                send('copy_chunk', { text: chunk.delta.text })
              }
            }

            try {
              const cleaned = buffer.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
              const parsed = JSON.parse(cleaned)
              aiHeadline = parsed.headline || ''
              aiSubheadline = parsed.subheadline || ''
              aiCtaText = parsed.ctaText || ''
              aiSeoDescription = parsed.seoDescription || ''
            } catch {}
          } catch (err) {
            console.warn('Streaming copy failed:', err)
          }
        }

        send('status', { step: 'building_html', message: 'Building your app...' })

        const html = generateAppHTML(templateType as TemplateType, {
          ...answers,
          projectId,
          notificationEmail: answers.contactEmail || answers.notificationEmail || '',
          _aiHeadline: aiHeadline,
          _aiSubheadline: aiSubheadline,
          _aiCtaText: aiCtaText,
          _aiSeoDescription: aiSeoDescription,
        })

        send('status', { step: 'saving', message: 'Deploying...' })
        saveApp(subdomain, { subdomain, name: rawName, templateType, html })

        const previewUrl = `${APP_URL}/api/preview/${subdomain}`

        await new Promise(r => setTimeout(r, 800)) // brief pause for UX

        send('done', {
          url: previewUrl.replace(/^https?:\/\//, ''),
          subdomain,
          projectId,
          name: rawName,
        })
      } catch (err) {
        send('error', { message: err instanceof Error ? err.message : 'Generation failed' })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
