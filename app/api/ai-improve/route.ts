import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getApp, saveApp } from '@/lib/store/apps'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

export async function POST(req: NextRequest) {
  const { subdomain, instruction, currentHtml } = await req.json()

  if (!client) {
    return NextResponse.json({
      improved: currentHtml || '',
      message: 'AI improve requires API key',
    })
  }

  // Get the current HTML from store if not provided
  const app = getApp(subdomain)
  const html = currentHtml || app?.html
  if (!html) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 })
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    system: 'You are improving a generated business web app. Apply ONLY the requested change to the HTML. Return the complete modified HTML, nothing else. Keep all existing structure and functionality intact.',
    messages: [
      {
        role: 'user',
        content: `Here is the current HTML of the app:\n\n${html}\n\nPlease apply this change: ${instruction}`,
      },
    ],
  })

  const improved = message.content[0].type === 'text' ? message.content[0].text : html

  // Save improved version back to store
  if (app) {
    saveApp(subdomain, {
      subdomain: app.subdomain,
      name: app.name,
      templateType: app.templateType,
      html: improved,
    })
  }

  return NextResponse.json({ improved, subdomain })
}
