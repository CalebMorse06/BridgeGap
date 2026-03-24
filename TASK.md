# VibeDeploy - Build Task

You are a senior engineer building VibeDeploy for a hackathon. Build everything - complete, working, beautiful code. No stubs, no placeholders.

## What Is VibeDeploy
AI-powered web app builder for non-technical users. User describes business in chat → AI generates complete web app → deploys LIVE to real URL in 3 minutes. No code required.

## Build Order

### Phase 1: Design System & Utilities

**lib/utils.ts**
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

**app/globals.css** - Replace with full design system:
- CSS variables for colors, shadows, radius
- @import Inter from Google Fonts  
- NO dark mode
- Tailwind directives

**tailwind.config.ts** - Extend with Inter font, custom colors, animations

**components/ui/** - Create these shadcn-style components:
- button.tsx (variants: default, outline, ghost, secondary, destructive; sizes: sm, default, lg, icon)
- input.tsx
- card.tsx (Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription)
- badge.tsx (default/blue, success/green, warning/yellow, outline)
- skeleton.tsx
- progress.tsx  
- textarea.tsx
- label.tsx
- switch.tsx
- separator.tsx

### Phase 2: Landing Page

**app/page.tsx** - Airbnb/Stripe-quality landing page. White background, blue accents.

Sections:
1. Sticky nav: "✨ VibeDeploy" logo + [Sign In] ghost button + [Start Building →] primary button
2. Hero (text-center, py-32):
   - Badge: "✨ Now in public beta"
   - H1: "Turn Your Idea Into a Real App" (5xl, bold)
   - Subtitle: "Describe what you need. We build it, host it, and make it live — in minutes. No coding required."
   - CTAs: [Start Building for Free →] + [See Examples]
   - Three floating app preview cards (framer-motion animate)
3. How It Works (3 steps with icons):
   - 💬 Describe Your Problem
   - 🔧 AI Builds Your App  
   - 🚀 Go Live Instantly
4. Template Gallery (4 cards):
   - 🔧 Service Booking (blue) - plumbers, cleaners, photographers
   - 🍕 Restaurant Menu (orange) - menus + online ordering
   - 🎉 Event Registration (green) - workshops, classes, meetups
   - 📋 Waitlist Manager (purple) - childcare, courses, beta
5. Testimonials (3 fake but realistic quotes)
6. CTA section (gradient bg): "Ready to stop waiting?"
7. Footer

### Phase 3: Build Flow (Chat Questionnaire)

**app/build/page.tsx** - Chat-style questionnaire

Chat UI: AI messages left (blue avatar + sparkle), user messages right (gray bubbles). Typing indicator (animated 3 dots). Auto-scroll. Framer Motion animate-in per message.

Template detection from first message:
- plumb|electric|clean|repair|hvac|handyman|photo|massage|lawn → service_booking
- restaurant|cafe|food|menu|pizza|sushi|taco|coffee|bakery → restaurant_menu  
- workshop|event|class|seminar|yoga|conference|meetup|webinar → event_registration
- childcare|daycare|waitlist|course|launch|limited|beta → waitlist

Questions per template (ask one at a time):

service_booking:
1. "What's your business called?" → businessName
2. "What services do you offer?" → services
3. "What days and hours do you work? (Mon-Fri 8am-5pm is common — does that work?)" → hours
4. "What city or area do you serve?" → location  
5. "Do you want customers to pay a deposit when booking? (yes or no)" → collectDeposits
6. "Should we send customers a text reminder before their appointment? (yes or no)" → smsReminders
7. "What's your email for booking notifications?" → contactEmail

restaurant_menu:
1. "What's your restaurant called?" → businessName
2. "What kind of food do you serve?" → cuisine
3. "What's your address and opening hours?" → addressAndHours
4. "Can you list your menu items? (name — description — price, one per line)" → menuItems
5. "Do you want customers to order online? (yes or no)" → onlineOrdering
6. "What's your phone number?" → contactPhone

event_registration:
1. "What's your event called?" → eventName
2. "Tell me about it — what's it about and who's it for?" → description
3. "When is it? (date and time)" → dateTime
4. "Where is it held?" → location
5. "How many people can attend?" → capacity
6. "Is this free or paid? If paid, what's the price?" → pricing
7. "What info do you need from people registering?" → registrationFields

waitlist:
1. "What are people waiting for?" → waitlistFor
2. "What's your org or business name?" → businessName
3. "How many total spots available?" → totalSpots
4. "What info do you need from signups?" → signupFields
5. "Should we email people when a spot opens? (yes or no)" → emailNotifications

After all questions, show inline integration cards:
- 💳 Accept Payments (Stripe) — toggle — "Test mode" badge
- 📱 SMS Notifications — toggle — "Test mode" badge
- 📧 Email Confirmations — toggle ON by default — "Free" badge

Then: [Generate & Deploy My App →] button

### Phase 4: Deploying Page

**app/build/deploying/page.tsx**

Animated checklist (items appear/check off with delay):
1. ✓ Understanding your requirements...
2. ✓ Designing your app...
3. ✓ Building your features...
4. ⏳ Deploying to the web... (spinner)
5. ○ Setting up your URL...

Friendly rotating messages: "Building your booking calendar...", "Setting up your features...", "Almost there!"
Calls /api/generate then /api/deploy
On success, redirect to /build/success

### Phase 5: Success Page

**app/build/success/page.tsx**
- Confetti on mount
- Big 🎉 + "Your app is live!"
- URL card with copy button
- QR code (qrcode package)
- [Open Your App →] primary CTA
- [Go to Dashboard] secondary

### Phase 6: Dashboard

**app/dashboard/page.tsx**
- Header: "My Apps" + [+ Build New App] button
- Stats: X apps live, X total visitors
- Project card grid (use mock data):
  - App name + template type badge
  - Live URL
  - Status dot (green = live)
  - [View] [Edit] [Share] buttons
- Empty state with CTA if no apps

### Phase 7: API Routes

**app/api/chat/route.ts**
POST: { message, history, template, step } → { response, detectedTemplate }
System prompt: warm, non-technical language. Never say "database", "API", "deploy". Say "setting up your booking system", "making it easy for customers". One question at a time.

**app/api/generate/route.ts**  
POST: { templateType, config, integrations } → { files: [{path, content}], subdomain }
Calls Claude to generate complete single-file HTML app.

**app/api/deploy/route.ts**
POST: { subdomain, files } → { url, deploymentId, status }
REAL Vercel API: POST https://api.vercel.com/v13/deployments
Authorization: Bearer ${process.env.VERCEL_API_TOKEN}

**app/api/projects/route.ts**
GET → projects list (mock for demo)
POST → create project

### Phase 8: App Templates

**lib/templates/generate-app.ts**
Main export: generateAppHTML(templateType: string, config: Record<string, string>) → string

Generate complete beautiful single-file HTML for each template:

SERVICE BOOKING:
- Hero: business name + "Book An Appointment" CTA
- Services grid from config.services (split by comma)
- Booking form: name, phone, service, preferred date/time, message
- Contact section: phone, email, hours, area
- Thank you message on submit

RESTAURANT MENU:
- Hero with restaurant name + cuisine type, gradient overlay
- Menu grid: parse config.menuItems (name — desc — price format)
- Hours + location section
- Phone CTA

EVENT REGISTRATION:
- Event hero: name, date, location
- Countdown timer (calculate from dateTime)
- Registration form (fields from config.registrationFields)
- Spots counter
- Add to Google Calendar button

WAITLIST:
- Hero: "Join the waitlist for [waitlistFor]"
- Signup form (fields from config.signupFields)
- Position display after signup
- "X people already waiting"

### Phase 9: Types & Support Files

**types/index.ts** - All TypeScript interfaces
**lib/anthropic.ts** - Anthropic client
**lib/supabase/client.ts** - Browser Supabase client
**lib/supabase/server.ts** - Server Supabase client  
**lib/deploy/vercel.ts** - deployToVercel() function
**.env.example** - All vars documented
**supabase/schema.sql** - Full schema

## Critical Rules
1. NO dark mode. White backgrounds only.
2. Zero TypeScript errors. Run tsc --noEmit and fix all.
3. Run npm run build at end. Fix all errors.
4. Commit after each phase.
5. Mobile-first responsive.
6. Framer Motion for animations.
7. Beautiful — this wins the hackathon.
8. Vercel API deploy is REAL, not mocked.

When npm run build passes, run:
openclaw system event --text "VibeDeploy build complete! Build passing, all phases done." --mode now
