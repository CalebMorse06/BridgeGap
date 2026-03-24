import { NextRequest, NextResponse } from 'next/server'
import { generateAppHTML, type TemplateType } from '@/lib/templates/generate-app'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { templateType, answers, integrations } = await req.json()
    if (!templateType || !answers) {
      return NextResponse.json({ error: 'Missing templateType or answers' }, { status: 400 })
    }

    // Create a project ID for tracking submissions
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const rawName = answers.businessName || answers.eventName || answers.waitlistFor || answers.yourName || 'myapp'
    const subdomain = slugify(rawName) || 'myapp'

    // Save project to Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/client')
        const admin = createAdminClient()
        await admin.from('projects').insert({
          id: projectId,
          name: rawName,
          template_type: templateType,
          subdomain,
          status: 'live',
          config: { answers, integrations },
          notification_email: answers.contactEmail || answers.contactPhone || null,
        })
      } catch (dbErr) {
        console.warn('DB save skipped:', dbErr)
      }
    }

    const html = generateAppHTML(templateType as TemplateType, {
      ...answers,
      projectId,
      notificationEmail: answers.contactEmail || '',
    })

    const files = [
      { file: 'index.html', data: html },
    ]

    return NextResponse.json({ files, subdomain, projectId, name: rawName })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate app' }, { status: 500 })
  }
}
