import { NextRequest, NextResponse } from 'next/server'
import { generateAppHTML, type TemplateType } from '@/lib/templates/generate-app'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { templateType, answers, integrations } = await req.json()

    if (!templateType || !answers) {
      return NextResponse.json({ error: 'Missing templateType or answers' }, { status: 400 })
    }

    const html = generateAppHTML(templateType as TemplateType, answers)

    // Generate subdomain from business name
    const rawName = answers.businessName || answers.eventName || answers.waitlistFor || 'myapp'
    const subdomain = slugify(rawName) || 'myapp'

    const files = [
      { file: 'index.html', data: html },
    ]

    return NextResponse.json({ files, subdomain })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate app' }, { status: 500 })
  }
}
