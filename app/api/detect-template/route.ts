import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Keyword → template matching (no API needed)
function detectByKeywords(msg: string): string | null {
  const m = msg.toLowerCase()

  if (/plumb|electr|hvac|cleaner|landscap|handyman|repair|mechanic|salon|barber|spa|massage|tutor|coach|trainer|consult|accountant|lawyer|attorney|dentist|doctor|veteri|pet groom|nanny|babysit|daycare|photog|videograph|wedding|realtor|pest control|mover|paint|roofing|contractor|flooring|carpet|pressure wash|window clean|auto detail|dog walk|car wash/.test(m)) return 'service_booking'
  if (/restaurant|cafe|coffee shop|bistro|diner|bakery|pizza|burger|sushi|taco|food truck|bar &|grill|steakhouse|seafood|chinese|italian|mexican|thai|indian|takeout|takeaway|dine/.test(m)) return 'restaurant_menu'
  if (/event|workshop|class|seminar|conference|meetup|summit|hackathon|concert|festival|webinar|bootcamp|register|ticket|rsvp/.test(m)) return 'event_registration'
  if (/waitlist|wait list|beta|early access|coming soon|notify me|limited spots|pre-launch|prelunch|pre launch/.test(m)) return 'waitlist'
  if (/portfolio|freelanc|designer|developer|illustrat|artist|architect|writer|photographer|brand|creative|showcase|hire me|personal site|resume/.test(m)) return 'portfolio'
  if (/donat|fundrais|nonprofit|non-profit|charity|cause|campaign|sponsor|crowdfund|give back|support us/.test(m)) return 'donation'
  if (/book|appointment|schedul|reserv|service business|client/.test(m)) return 'service_booking'
  if (/launch|startup|new app|new product/.test(m)) return 'waitlist'
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ template: null })

    // 1. Fast keyword matching (no API needed)
    const keyword = detectByKeywords(message)
    if (keyword) return NextResponse.json({ template: keyword })

    // 2. AI fallback for freeform/ambiguous text
    if (!client) return NextResponse.json({ template: null })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 20,
      system: `Classify into ONE of: service_booking, restaurant_menu, event_registration, waitlist, portfolio, donation, unknown. Reply with ONLY the category name.`,
      messages: [{ role: 'user', content: message }],
    })

    const text = (response.content[0].type === 'text' ? response.content[0].text : '').trim().toLowerCase()
    const valid = ['service_booking', 'restaurant_menu', 'event_registration', 'waitlist', 'portfolio', 'donation']
    return NextResponse.json({ template: valid.includes(text) ? text : null })
  } catch {
    return NextResponse.json({ template: null })
  }
}
