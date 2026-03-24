import { NextRequest, NextResponse } from 'next/server'
import { generateAppHTML, type TemplateType } from '@/lib/templates/generate-app'
import { generateAppCopy } from '@/lib/ai/generate-copy'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { templateType, answers, integrations } = await req.json()
    if (!templateType || !answers) {
      return NextResponse.json({ error: 'Missing templateType or answers' }, { status: 400 })
    }

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const rawName = answers.businessName || answers.eventName || answers.waitlistFor || answers.yourName || answers.organizationName || 'myapp'
    const subdomain = slugify(rawName) || 'myapp'

    // Generate AI-powered custom copy (falls back gracefully)
    const copy = await generateAppCopy(templateType, answers)

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
          config: { answers, integrations, copy },
          notification_email: answers.contactEmail || null,
        })
      } catch (dbErr) {
        console.warn('DB save skipped:', dbErr)
      }
    }

    const html = generateAppHTML(templateType as TemplateType, {
      ...answers,
      projectId,
      notificationEmail: answers.contactEmail || '',
      // Pass AI copy as JSON for template to use
      _aiHeadline: copy.headline,
      _aiSubheadline: copy.subheadline,
      _aiCtaText: copy.ctaText,
      _aiSeoDescription: copy.seoDescription,
    })

    return NextResponse.json({
      files: [{ file: 'index.html', data: html }],
      subdomain,
      projectId,
      name: rawName,
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate app' }, { status: 500 })
  }
}
