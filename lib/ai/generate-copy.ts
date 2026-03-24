import Anthropic from '@anthropic-ai/sdk'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

export interface AppCopy {
  headline: string
  subheadline: string
  ctaText: string
  trustBadges: string[]
  seoDescription: string
  sectionTitles: Record<string, string>
}

const FALLBACK_COPY: Record<string, AppCopy> = {
  service_booking: {
    headline: 'Professional Service You Can Count On',
    subheadline: 'Book your appointment online in seconds — no phone calls, no waiting.',
    ctaText: 'Book an Appointment',
    trustBadges: ['⭐ 5-Star Rated', '✅ Licensed & Insured', '🕐 Quick Response'],
    seoDescription: 'Book professional services online. Fast, reliable, and convenient.',
    sectionTitles: { services: 'Our Services', howItWorks: 'How It Works', cta: 'Book Now' },
  },
  restaurant_menu: {
    headline: 'Authentic Flavors, Made With Love',
    subheadline: 'Come for the food, stay for the experience.',
    ctaText: 'See Our Menu',
    trustBadges: ['🍽️ Fresh Daily', '⭐ Locally Loved', '📍 Dine In or Take Out'],
    seoDescription: 'View our full menu, hours, and location. Order online or visit us today.',
    sectionTitles: { menu: 'Our Menu', location: 'Find Us', cta: 'Order Now' },
  },
  event_registration: {
    headline: 'Don\'t Miss Out',
    subheadline: 'Limited spots available. Register now to secure yours.',
    ctaText: 'Reserve My Spot',
    trustBadges: ['🎟️ Instant Confirmation', '📧 Email Reminder', '🔒 Secure Registration'],
    seoDescription: 'Register for this event. Limited spots — sign up before they\'re gone.',
    sectionTitles: { details: 'Event Details', register: 'Register Now', cta: 'Get Your Spot' },
  },
  waitlist: {
    headline: 'Be The First To Know',
    subheadline: 'Limited spots. Sign up now and we\'ll let you know the moment you\'re in.',
    ctaText: 'Join the Waitlist',
    trustBadges: ['🔔 Auto-Notify', '🔒 No Spam', '⚡ Instant Updates'],
    seoDescription: 'Join the waitlist. Limited availability — sign up to get notified.',
    sectionTitles: { progress: 'Current Status', signup: 'Join Now', cta: 'Get In Line' },
  },
  portfolio: {
    headline: 'Let\'s Build Something Great',
    subheadline: 'Available for new projects and collaborations.',
    ctaText: 'Let\'s Work Together',
    trustBadges: ['✨ Creative Solutions', '🎯 Results-Driven', '💬 Great Communication'],
    seoDescription: 'Professional portfolio. View work samples and get in touch for your next project.',
    sectionTitles: { skills: 'What I Do', work: 'Recent Work', contact: 'Get In Touch' },
  },
  donation: {
    headline: 'Every Dollar Makes a Difference',
    subheadline: 'Your support helps us create lasting impact in our community.',
    ctaText: 'Donate Now',
    trustBadges: ['❤️ Tax Deductible', '🔒 Secure', '📧 Receipt Included'],
    seoDescription: 'Support our cause. Every donation helps make a difference.',
    sectionTitles: { progress: 'Our Progress', donate: 'Make a Donation', impact: 'Your Impact' },
  },
}

export async function generateAppCopy(
  templateType: string,
  answers: Record<string, string>
): Promise<AppCopy> {
  // Always return fallback if no API key
  if (!client) {
    return FALLBACK_COPY[templateType] || FALLBACK_COPY.service_booking
  }

  try {
    const businessInfo = Object.entries(answers)
      .filter(([k, v]) => v && !k.startsWith('brand') && !k.startsWith('project'))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 500,
      system: `You are a world-class copywriter for small business websites. Write punchy, confident, warm copy. Never use jargon. Return ONLY valid JSON matching this exact structure:
{
  "headline": "short powerful headline (max 8 words)",
  "subheadline": "one sentence that makes people want to take action (max 20 words)",
  "ctaText": "action button text (2-4 words)",
  "trustBadges": ["emoji + short badge text", "emoji + short badge text", "emoji + short badge text"],
  "seoDescription": "SEO meta description (max 150 chars)",
  "sectionTitles": {"key": "title"}
}`,
      messages: [
        {
          role: 'user',
          content: `Write custom copy for a ${templateType.replace('_', ' ')} app:\n\n${businessInfo}\n\nReturn ONLY the JSON. No markdown, no explanation.`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned) as AppCopy

    // Validate required fields exist
    if (!parsed.headline || !parsed.ctaText) throw new Error('Invalid copy')
    return parsed
  } catch (err) {
    console.warn('AI copy generation failed, using fallback:', err)
    return FALLBACK_COPY[templateType] || FALLBACK_COPY.service_booking
  }
}
