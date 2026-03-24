'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle, Zap, Calendar, UtensilsCrossed, Users, ListChecks, Star, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const templates = [
  {
    icon: '🔧',
    title: 'Service Booking',
    description: 'Let customers book appointments online. Perfect for plumbers, cleaners, photographers, tutors.',
    color: 'blue',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-700',
    examples: ['Plumbing', 'Cleaning', 'Photography'],
  },
  {
    icon: '🍕',
    title: 'Restaurant Menu',
    description: 'A beautiful menu site with your full menu, hours, and location. Online ordering optional.',
    color: 'orange',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    textColor: 'text-orange-700',
    examples: ['Restaurants', 'Cafes', 'Food Trucks'],
  },
  {
    icon: '🎉',
    title: 'Event Registration',
    description: 'Collect RSVPs and sell tickets for workshops, classes, and events.',
    color: 'green',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    textColor: 'text-green-700',
    examples: ['Workshops', 'Classes', 'Meetups'],
  },
  {
    icon: '📋',
    title: 'Waitlist Manager',
    description: 'Manage signups for limited spots. Auto-notify when spots open.',
    color: 'purple',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    textColor: 'text-purple-700',
    examples: ['Childcare', 'Courses', 'Beta Launches'],
  },
]

const steps = [
  {
    icon: '💬',
    step: '01',
    title: 'Describe your problem',
    description: 'Tell us what you need in plain English. No technical knowledge required. Just talk about your business.',
  },
  {
    icon: '🔧',
    step: '02',
    title: 'AI builds your app',
    description: 'We generate a complete, working web app tailored to your exact needs — booking system, menu, event page, or more.',
  },
  {
    icon: '🚀',
    step: '03',
    title: 'Go live instantly',
    description: 'Your app deploys to a real URL in under 60 seconds. Share it with customers immediately.',
  },
]

const testimonials = [
  {
    quote: "I had a booking site in 4 minutes. My wife thought I hired a developer.",
    name: 'Bob Martinez',
    title: 'Martinez Plumbing, Austin TX',
    avatar: '👷',
  },
  {
    quote: "Finally got off Yelp. My menu site looks more professional than my competitors.",
    name: 'Sarah Chen',
    title: 'Golden Dragon Restaurant',
    avatar: '🍜',
  },
  {
    quote: "Sold out my first yoga workshop the same day I launched. Customers could actually register.",
    name: 'Maya Johnson',
    title: 'Flow Yoga Studio',
    avatar: '🧘',
  },
]

const floatingCards = [
  {
    title: "Bob's Plumbing",
    subtitle: 'Service Booking',
    stat: '12 bookings today',
    color: 'border-blue-100 bg-blue-50/80',
    delay: '0s',
  },
  {
    title: 'Taco Fiesta',
    subtitle: 'Restaurant Menu',
    stat: '247 menu views',
    color: 'border-orange-100 bg-orange-50/80',
    delay: '1s',
  },
  {
    title: 'Morning Flow Yoga',
    subtitle: 'Event Registration',
    stat: '38 / 40 spots filled',
    color: 'border-green-100 bg-green-50/80',
    delay: '2s',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="text-lg font-bold text-gray-900">VibeDeploy</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/build">
                  Start Building <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-100">
            <Sparkles className="h-3.5 w-3.5" />
            Now in public beta — free to try
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Turn your idea into{' '}
            <span className="gradient-text">a real app</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Describe what your business needs. We build it, host it, and make it live — in minutes. No coding, no setup, no developer required.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild className="text-base">
              <Link href="/build">
                Start Building for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="text-base gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              See Examples
            </Button>
          </div>

          {/* Trust */}
          <p className="mt-6 text-sm text-gray-400">
            No credit card required · Live in under 3 minutes
          </p>
        </div>

        {/* Floating App Preview Cards */}
        <div className="mx-auto mt-16 max-w-5xl px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
            {floatingCards.map((card, i) => (
              <div
                key={card.title}
                className={`rounded-xl border ${card.color} p-4 shadow-md backdrop-blur w-full sm:w-56 animate-float`}
                style={{ animationDelay: card.delay, animationDuration: '3s' }}
              >
                <div className="text-xs font-medium text-gray-500 mb-1">{card.subtitle}</div>
                <div className="font-semibold text-gray-900 text-sm">{card.title}</div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-500">{card.stat}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-sm text-gray-400">
            Real apps built by real businesses using VibeDeploy
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">How it works</div>
            <h2 className="text-4xl font-bold text-gray-900">Three steps. That's it.</h2>
            <p className="mt-4 text-lg text-gray-500">No tutorials, no setup guides. Just describe your problem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] right-[-40%] h-0.5 bg-gray-200 z-0" />
                )}
                <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="bg-white px-4 py-24 sm:px-6" id="templates">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Templates</div>
            <h2 className="text-4xl font-bold text-gray-900">Built for real businesses</h2>
            <p className="mt-4 text-lg text-gray-500">Pick a starting point — or just describe your problem and we'll figure it out.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Link key={template.title} href={`/build?template=${template.title.toLowerCase().replace(' ', '_')}`}>
                <div className={`rounded-2xl ${template.bg} border border-${template.color}-100 p-6 h-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group`}>
                  <div className={`${template.iconBg} rounded-xl p-3 w-12 h-12 flex items-center justify-center text-2xl mb-4`}>
                    {template.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.examples.map((ex) => (
                      <span key={ex} className={`text-xs ${template.textColor} ${template.iconBg} px-2 py-0.5 rounded-full font-medium`}>
                        {ex}
                      </span>
                    ))}
                  </div>
                  <div className={`mt-4 text-sm font-medium ${template.textColor} group-hover:underline`}>
                    Use this template →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gray-900">1,200+</div>
            <div className="text-lg text-gray-500 mt-2">apps deployed and live</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to stop waiting?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of business owners who built their app today. No developer, no wait, no excuses.
          </p>
          <Button size="xl" variant="white" asChild>
            <Link href="/build">
              Build My App — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-blue-200">Takes about 3 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-bold text-gray-900">VibeDeploy</span>
              <span className="text-gray-400 text-sm ml-2">From idea to live app in minutes.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/build" className="hover:text-gray-900 transition-colors">Build</Link>
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <Link href="#templates" className="hover:text-gray-900 transition-colors">Templates</Link>
              <span className="text-gray-300">|</span>
              <span>© 2026 VibeDeploy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
