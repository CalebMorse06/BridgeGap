# ✨ VibeDeploy

**From idea to live app in 60 seconds.**

VibeDeploy lets anyone — regardless of technical skill — describe their business problem in plain English and get a fully working web app deployed to a live URL instantly. No coding, no setup, no developer required.

## 🎯 The Problem

Small business owners need an online presence — booking pages, menus, event registration — but:
- Hiring a developer costs $2,000–$10,000+
- Website builders (Wix, Squarespace) still require hours of learning
- Template solutions don't actually *work* — no real forms, no databases, no notifications

## 💡 The Solution

VibeDeploy bridges the gap. Have a conversation, get a real working app:

1. **Describe your problem** — "I'm a plumber and need customers to book online"
2. **AI builds your app** — complete with forms, database, email notifications
3. **Live in 60 seconds** — deployed to a real URL, ready to share

## 🚀 What Makes It Different

This isn't another AI website builder. Every app VibeDeploy generates is a **real working web application**:

- **📝 Real form submissions** → saved to a Supabase database
- **📧 Email notifications** → via Resend, sent to the business owner on every submission
- **📊 Admin dashboard** → view and manage bookings, registrations, and signups
- **📱 QR code** → downloadable, scannable — perfect for print, storefronts, receipts
- **🎨 Brand customization** → pick your color, see it live before deploying
- **🤖 AI-written copy** → Claude generates unique headlines and CTAs for each app
- **📈 Built-in analytics** → page view tracking on every generated app
- **🔒 Secure by default** → HTTPS, encrypted data, proper CORS

## 📦 6 App Templates

| Template | Use Case | Features |
|----------|----------|----------|
| 🔧 **Service Booking** | Plumbers, cleaners, coaches | Booking form, service picker, date/time, confirmations |
| 🍕 **Restaurant Menu** | Restaurants, cafes, food trucks | Full menu display, ordering CTA, location/hours |
| 🎉 **Event Registration** | Workshops, classes, meetups | Registration form, capacity tracking, pricing |
| 📋 **Waitlist** | Beta launches, limited programs | Waitlist signup, position tracking, progress bar |
| 🎨 **Portfolio** | Freelancers, creatives | Skills showcase, bio, contact form |
| ❤️ **Donation** | Nonprofits, fundraisers | Donation form, goal tracker, amount presets |

## 🛠️ Tech Stack

- **Next.js 14** (App Router, TypeScript, Turbopack)
- **Tailwind CSS + shadcn/ui** (Radix UI primitives, CVA variants)
- **Claude AI** (Anthropic SDK — template detection + custom copy generation)
- **Supabase** (PostgreSQL database, RLS policies)
- **Vercel Deployment API** (real production deployments in ~30s)
- **Resend** (transactional email notifications)
- **QR Code** (client-side generation + download)
- **Framer Motion** ready (installed, available for animations)

## 📁 Architecture

```
app/
├── page.tsx                  # Landing page (animated typing, stats, testimonials)
├── build/
│   ├── page.tsx              # Chat questionnaire + live preview (split screen)
│   ├── deploying/page.tsx    # Deployment progress with animated steps
│   └── success/page.tsx      # Success page with QR code + next steps
├── dashboard/
│   ├── page.tsx              # All apps overview with stats
│   └── [id]/page.tsx         # Per-app admin: submissions, confirm/decline
├── api/
│   ├── generate/route.ts     # AI copy + HTML generation
│   ├── deploy/route.ts       # Vercel deployment API
│   ├── submissions/route.ts  # Form submission handler + email notification
│   ├── analytics/route.ts    # Page view tracking
│   ├── detect-template/route.ts  # AI template classification
│   ├── chat/route.ts         # Claude chat endpoint
│   └── projects/route.ts     # Project CRUD
├── error.tsx                 # Global error boundary
├── not-found.tsx             # Custom 404
└── loading.tsx               # Loading state
lib/
├── templates/generate-app.ts # 6 HTML template generators (42KB of production HTML)
├── ai/generate-copy.ts       # Claude-powered copywriting
├── supabase/
│   ├── client.ts             # Supabase client + types
│   └── schema.sql            # Database schema
└── utils.ts                  # cn(), slugify(), formatDate()
components/
├── build/
│   ├── chat-message.tsx      # Chat bubble component
│   ├── quick-replies.tsx     # Tap-to-reply chips
│   ├── integration-panel.tsx # Feature toggles
│   └── live-preview.tsx      # Real-time app preview iframe
└── ui/                       # 10 shared UI components
```

## 🏃 Quick Start

```bash
# Clone
git clone https://github.com/your-org/vibedeploy.git
cd vibedeploy

# Install
npm install

# Configure
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY and optionally VERCEL_API_TOKEN

# Run
npm run dev
```

## 🌐 Deployment

```bash
# Deploy VibeDeploy itself
npx vercel --prod

# Set environment variables in Vercel dashboard:
# ANTHROPIC_API_KEY, VERCEL_API_TOKEN, SUPABASE_*, RESEND_API_KEY
```

## 📊 Hackathon Track

**Vibe the Gap — Problem #2: Bridging the Digital Divide**

VibeDeploy directly solves the accessibility gap in web development by making functional web applications available to anyone who can describe their problem in plain English. No technical knowledge, no code, no ENV files — just a conversation.

---

Built with ❤️ for the hackathon · © 2026 VibeDeploy
