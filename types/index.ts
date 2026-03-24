export type TemplateType = 'service_booking' | 'restaurant_menu' | 'event_registration' | 'waitlist' | null

export interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

export interface Integration {
  type: 'stripe' | 'twilio' | 'resend' | 'analytics'
  enabled: boolean
  useOwnKeys: boolean
  config?: Record<string, string>
}

export interface ProjectConfig {
  templateType: TemplateType
  answers: Record<string, string>
  integrations: Integration[]
  brandColor?: string
  subdomain?: string
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface DeploymentResult {
  url: string
  deploymentId: string
  status: 'building' | 'ready' | 'error'
}

export interface Project {
  id: string
  name: string
  templateType: TemplateType
  subdomain: string
  deploymentUrl: string
  status: 'draft' | 'deploying' | 'live' | 'error'
  createdAt: string
  deployedAt?: string
  config: ProjectConfig
  stats?: {
    views: number
    actions: number
  }
}

export const TEMPLATE_QUESTIONS: Record<string, Array<{ key: string; question: string; suggestion?: string }>> = {
  service_booking: [
    { key: 'businessName', question: "What's your business called?" },
    { key: 'services', question: 'What services do you offer? You can just list them out — like "drain cleaning, repairs, installations"' },
    { key: 'hours', question: 'What days and hours do you typically work?', suggestion: 'Mon–Fri 8am–5pm is common — does that work for you?' },
    { key: 'location', question: 'What city or area do you serve?' },
    { key: 'collectDeposits', question: 'Would you like customers to pay a small deposit when they book? (just say yes or no)' },
    { key: 'smsReminders', question: 'Should we send customers a text message reminder before their appointment? (yes or no)' },
    { key: 'contactEmail', question: "Last one — what's your email so we can send you booking notifications?" },
  ],
  restaurant_menu: [
    { key: 'businessName', question: "What's your restaurant called?" },
    { key: 'cuisine', question: 'What kind of food do you serve?' },
    { key: 'addressAndHours', question: "What's your address and opening hours?" },
    { key: 'menuItems', question: 'Can you share your menu items? Paste them as: Name — short description — price (one per line). Example: Carnitas Tacos — slow-cooked pork with cilantro — $3.50' },
    { key: 'onlineOrdering', question: 'Would you like customers to be able to order online? (yes or no)' },
    { key: 'contactPhone', question: "What's your phone number?" },
  ],
  event_registration: [
    { key: 'eventName', question: "What's the name of your event?" },
    { key: 'description', question: "Tell me a bit about it — what's it about and who's it for?" },
    { key: 'dateTime', question: 'When is it happening? (date and time)' },
    { key: 'location', question: 'Where is it being held? (or just say "online" if it\'s virtual)' },
    { key: 'capacity', question: 'How many people can attend?' },
    { key: 'pricing', question: 'Is this event free, or will people need to buy a ticket? If paid, what\'s the price?' },
    { key: 'registrationFields', question: 'What info do you need from people when they register? Name and email is standard — anything else like phone number or dietary needs?' },
  ],
  waitlist: [
    { key: 'waitlistFor', question: "What are people signing up to wait for?" },
    { key: 'businessName', question: "What's your organization or business name?" },
    { key: 'totalSpots', question: 'How many total spots are available?' },
    { key: 'signupFields', question: 'What info do you need from people joining the waitlist? (name and email is standard)' },
    { key: 'emailNotifications', question: 'Should we automatically email people when a spot opens up for them? (yes or no)' },
  ],
}

export function detectTemplate(message: string): TemplateType {
  const lower = message.toLowerCase()
  if (/plumb|electr|clean|repair|hvac|handyman|photo|massage|lawn|landscap|pest|paint|roof|tutor|coach/.test(lower)) {
    return 'service_booking'
  }
  if (/restaurant|cafe|food|menu|pizza|sushi|taco|burger|coffee|bakery|diner|bistro|bar|grill|kitchen/.test(lower)) {
    return 'restaurant_menu'
  }
  if (/workshop|event|class|seminar|yoga|fitness|conference|meetup|webinar|training|retreat|concert|show/.test(lower)) {
    return 'event_registration'
  }
  if (/childcare|daycare|waitlist|course|launch|limited|beta|program|enrollment|sign.?up/.test(lower)) {
    return 'waitlist'
  }
  return null
}
