import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!client || !message) {
      return NextResponse.json({ template: null })
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 50,
      system: `You classify user messages into one of these app template categories. Return ONLY the category name, nothing else.

Categories:
- service_booking (any service provider: plumber, cleaner, photographer, coach, mechanic, salon, etc.)
- restaurant_menu (any food business: restaurant, cafe, food truck, bakery, bar, etc.)
- event_registration (any event: workshop, class, meetup, concert, conference, etc.)
- waitlist (limited spots, beta launch, enrollment, queue, etc.)
- portfolio (freelancer, creative, consultant, personal brand, etc.)
- donation (nonprofit, fundraiser, charity, cause, etc.)
- unknown (if you genuinely can't tell)

Return ONLY the category name.`,
      messages: [{ role: 'user', content: message }],
    })

    const text = (response.content[0].type === 'text' ? response.content[0].text : '').trim().toLowerCase()
    const valid = ['service_booking', 'restaurant_menu', 'event_registration', 'waitlist', 'portfolio', 'donation']
    const template = valid.includes(text) ? text : null

    return NextResponse.json({ template })
  } catch {
    return NextResponse.json({ template: null })
  }
}
