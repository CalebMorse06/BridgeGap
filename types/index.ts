export type TemplateType = 'service_booking' | 'restaurant_menu' | 'event_registration' | 'waitlist' | 'portfolio' | 'donation' | null

export interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
  quickReplies?: string[]
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

export interface Question {
  key: string
  question: string
  suggestion?: string
  quickReplies?: string[]
  multiline?: boolean
}

export const TEMPLATE_QUESTIONS: Record<string, Question[]> = {
  service_booking: [
    {
      key: 'businessName',
      question: "What's your business called?",
      quickReplies: [],
    },
    {
      key: 'services',
      question: 'What services do you offer? List them out — like "drain cleaning, pipe repairs, installations"',
      suggestion: 'You can list as many as you like, separated by commas',
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'hours',
      question: 'What days and hours do you typically work?',
      suggestion: 'Just tell me roughly — you can update this later',
      quickReplies: ['Mon–Fri 8am–5pm', 'Mon–Sat 7am–6pm', 'Mon–Sun 9am–5pm', 'Flexible / By appointment'],
    },
    {
      key: 'location',
      question: 'What city or area do you serve?',
      quickReplies: [],
    },
    {
      key: 'collectDeposits',
      question: 'Would you like customers to pay a small deposit when they book online?',
      quickReplies: ["Yes, I'd like a deposit", "No, I'll collect payment in person", 'Not sure yet'],
    },
    {
      key: 'contactEmail',
      question: "Last one — what's your email so we can send you booking notifications?",
      quickReplies: [],
    },
  ],
  restaurant_menu: [
    {
      key: 'businessName',
      question: "What's your restaurant called?",
      quickReplies: [],
    },
    {
      key: 'cuisine',
      question: 'What kind of food do you serve?',
      quickReplies: ['Mexican', 'Italian', 'American', 'Asian', 'Pizza', 'Burgers', 'Mediterranean', 'BBQ'],
    },
    {
      key: 'addressAndHours',
      question: "What's your address and opening hours?",
      suggestion: 'Example: 123 Main St, Austin TX · Mon–Fri 11am–9pm, Sat–Sun 12pm–10pm',
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'menuItems',
      question: 'Share your menu items! One per line:\nName — description — price\n\nExample:\nCarnitas Tacos — slow-cooked pork, cilantro, lime — $3.50',
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'onlineOrdering',
      question: 'Would you like a button for customers to call and order online?',
      quickReplies: ['Yes, add an order button', 'No, menu only is fine'],
    },
    {
      key: 'contactPhone',
      question: "What's your phone number?",
      quickReplies: [],
    },
  ],
  event_registration: [
    {
      key: 'eventName',
      question: "What's the name of your event?",
      quickReplies: [],
    },
    {
      key: 'description',
      question: "Tell me what it's about and who should come.",
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'dateTime',
      question: 'When is it? (date and time)',
      quickReplies: [],
    },
    {
      key: 'location',
      question: "Where is it being held?",
      quickReplies: ['Online / Virtual', 'TBD — will confirm soon'],
    },
    {
      key: 'capacity',
      question: 'How many people can attend?',
      quickReplies: ['10', '25', '50', '100', '200', 'Unlimited'],
    },
    {
      key: 'pricing',
      question: "Is this event free, or do people need to buy a ticket?",
      quickReplies: ['Free', '$10', '$25', '$50', '$75', '$100'],
    },
  ],
  waitlist: [
    {
      key: 'waitlistFor',
      question: "What are people signing up to wait for?",
      quickReplies: [],
    },
    {
      key: 'businessName',
      question: "What's your organization or business name?",
      quickReplies: [],
    },
    {
      key: 'totalSpots',
      question: 'How many total spots will be available?',
      quickReplies: ['10', '25', '50', '100', '200', '500'],
    },
    {
      key: 'emailNotifications',
      question: "Should we automatically email people when a spot opens up for them?",
      quickReplies: ['Yes, auto-notify them', "No, I'll notify manually"],
    },
  ],
  portfolio: [
    {
      key: 'yourName',
      question: "What's your name?",
      quickReplies: [],
    },
    {
      key: 'role',
      question: 'What do you do?',
      quickReplies: ['Web Designer', 'Photographer', 'Consultant', 'Developer', 'Illustrator', 'Videographer', 'Writer', 'Coach'],
    },
    {
      key: 'bio',
      question: 'Write a short bio — a sentence or two about yourself and what you bring to clients.',
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'skills',
      question: 'List your key skills or services, separated by commas.',
      suggestion: 'Example: Web Design, Brand Identity, UI/UX, Photography',
      quickReplies: [],
    },
    {
      key: 'contactEmail',
      question: "What's your email so potential clients can reach you?",
      quickReplies: [],
    },
  ],
  donation: [
    {
      key: 'organizationName',
      question: "What's the name of your organization or cause?",
      quickReplies: [],
    },
    {
      key: 'mission',
      question: 'Describe your mission in a sentence or two — what are you working to achieve?',
      quickReplies: [],
      multiline: true,
    },
    {
      key: 'fundraisingGoal',
      question: "What's your fundraising goal?",
      quickReplies: ['$1,000', '$5,000', '$10,000', '$25,000', '$50,000'],
    },
    {
      key: 'notificationEmail',
      question: "What email should we send donation notifications to?",
      quickReplies: [],
    },
  ],
}

export function detectTemplate(message: string): TemplateType {
  const lower = message.toLowerCase()
  if (/plumb|electr|clean|repair|hvac|handyman|photo|massage|lawn|landscap|pest|paint|roof|tutor|coach|contractor|mechanic|salon|barber|spa|personal trainer|delivery/.test(lower)) {
    return 'service_booking'
  }
  if (/restaurant|cafe|food|menu|pizza|sushi|taco|burger|coffee|bakery|diner|bistro|bar|grill|kitchen|chinese|thai|indian|japanese|korean/.test(lower)) {
    return 'restaurant_menu'
  }
  if (/workshop|event|class|seminar|yoga|fitness|conference|meetup|webinar|training|retreat|concert|show|lecture|course|fundraiser/.test(lower)) {
    return 'event_registration'
  }
  if (/childcare|daycare|waitlist|launch|limited|beta|program|enrollment|sign.?up|queue|list|opening/.test(lower)) {
    return 'waitlist'
  }
  if (/portfolio|freelanc|creative|personal.?site|my.?work|showcase|hire.?me|consultant|design|illustrat|videograph/.test(lower)) {
    return 'portfolio'
  }
  if (/donat|fundrais|nonprofit|non.?profit|charity|cause|campaign|give|support|ngo|foundation/.test(lower)) {
    return 'donation'
  }
  return null
}

export function getQuickRepliesForStep(templateType: string, questionIndex: number): string[] {
  const questions = TEMPLATE_QUESTIONS[templateType]
  if (!questions || questionIndex >= questions.length) return []
  return questions[questionIndex].quickReplies || []
}
