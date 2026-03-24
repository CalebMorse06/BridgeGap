'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Star, Zap, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Business types that cycle in the hero subtitle
const BUSINESS_TYPES = ['plumber', 'restaurant', 'yoga studio', 'nonprofit', 'photographer']

// Activity ticker messages
const ACTIVITY_MESSAGES = [
  'Sarah just built a spa booking app in Austin ✨',
  'Marcus built a pizza menu for Golden Dragon in NYC ✨',
  'A yoga studio in Denver just went live ✨',
  'James built a fundraiser page in 47 seconds ✨',
  'A plumber in Chicago just got their first booking ✨',
]

const TEMPLATES = [
  { icon: '🔧', title: 'Service Booking', desc: 'Plumbers, cleaners, photographers, coaches — let customers book you online.', color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200', badge: 'Most popular', badgeColor: 'bg-blue-600 text-white' },
  { icon: '🍕', title: 'Restaurant Menu', desc: 'Beautiful menu site with hours, location, and optional online ordering.', color: 'from-orange-50 to-orange-100/50', border: 'border-orange-200', badge: '', badgeColor: '' },
  { icon: '🎉', title: 'Event Registration', desc: 'Workshops, classes, concerts — collect RSVPs and sell tickets.', color: 'from-green-50 to-green-100/50', border: 'border-green-200', badge: '', badgeColor: '' },
  { icon: '📋', title: 'Waitlist Manager', desc: 'Manage limited spots and auto-notify people when they get in.', color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200', badge: '', badgeColor: '' },
  { icon: '🎨', title: 'Portfolio', desc: 'Freelancers and creatives — showcase work, collect leads.', color: 'from-indigo-50 to-indigo-100/50', border: 'border-indigo-200', badge: 'New', badgeColor: 'bg-indigo-500 text-white' },
  { icon: '❤️', title: 'Donation Page', desc: 'Nonprofits and causes — fundraising with a goal tracker.', color: 'from-red-50 to-red-100/50', border: 'border-red-200', badge: 'New', badgeColor: 'bg-red-500 text-white' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '💬', title: 'Describe your problem', body: 'Just talk. Tell us what your business needs. No technical words required — speak naturally.' },
  { step: '02', icon: '🔧', title: 'AI builds your app', body: 'We create a complete, working web app: forms, pages, styling, integrations — the real thing.' },
  { step: '03', icon: '🚀', title: 'Live in 60 seconds', body: 'Your app deploys to a real URL instantly. Share it, print a QR code, add it to Google Business.' },
]

const STATS = [
  { value: '2,400+', label: 'Apps deployed' },
  { value: '< 60s', label: 'Average deploy time' },
  { value: '6', label: 'App templates' },
  { value: '100%', label: 'No code required' },
]

const TESTIMONIALS = [
  { quote: "Had my booking page up in 3 minutes. My wife thought I hired a developer.", name: 'Bob Martinez', biz: 'Martinez Plumbing, Austin TX', avatar: '👷', stars: 5 },
  { quote: "Finally got off Yelp. My menu site looks more professional than competitors.", name: 'Sarah Chen', biz: 'Golden Dragon Restaurant', avatar: '🍜', stars: 5 },
  { quote: "Sold out my yoga workshop the same day I launched. Customers could actually register.", name: 'Maya Johnson', biz: 'Flow Yoga Studio', avatar: '🧘', stars: 5 },
]

// Animated business type cycler — smooth crossfade
function BusinessTypeCycler() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % BUSINESS_TYPES.length)
        setVisible(true)
      }, 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="inline-block transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {BUSINESS_TYPES[index]}
    </span>
  )
}

// Activity ticker with slide-up animation
function ActivityTicker() {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIndex(i => (i + 1) % ACTIVITY_MESSAGES.length)
        setAnimating(false)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-2.5 bg-white border border-gray-100 shadow-sm rounded-full px-5 py-2.5 overflow-hidden" style={{ maxWidth: '100%' }}>
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
      <div style={{ height: '20px', overflow: 'hidden', position: 'relative' }}>
        <p
          className="text-sm text-gray-600 whitespace-nowrap"
          style={{
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(-20px)' : 'translateY(0)',
          }}
        >
          {ACTIVITY_MESSAGES[index]}
        </p>
      </div>
    </div>
  )
}

// Animated app card preview
function AppCardPreview() {
  const apps = [
    { name: "Bob's Plumbing", type: 'Booking', stat: '12 new requests', color: 'border-blue-200 bg-blue-50', dot: 'bg-blue-500' },
    { name: 'Taco Fiesta', type: 'Menu', stat: '847 visitors today', color: 'border-orange-200 bg-orange-50', dot: 'bg-orange-500' },
    { name: 'Flow Yoga Workshop', type: 'Registration', stat: '38 / 40 spots filled', color: 'border-green-200 bg-green-50', dot: 'bg-green-500' },
  ]
  return (
    <div className="space-y-3">
      {apps.map((app, i) => (
        <div
          key={app.name}
          className={`rounded-xl border ${app.color} p-4 shadow-sm`}
          style={{ animation: 'slideUp 0.6s ease-out both', animationDelay: `${i * 0.15}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{app.type}</p>
              <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`w-1.5 h-1.5 rounded-full ${app.dot} animate-pulse`} />
                <span className="text-xs font-medium text-gray-600">Live</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{app.stat}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="text-lg font-black text-gray-900">VibeDeploy</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500 font-medium">
              <a href="#templates" className="hover:text-gray-900 transition-colors">Templates</a>
              <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
              <Link href="/gallery" className="hover:text-gray-900 transition-colors">Gallery</Link>
              <Link href="/demo" className="hover:text-gray-900 transition-colors">Live Demo</Link>
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/build">
                  Start Building <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6">
        {/* Background blur orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Now in public beta
            </div>

            {/* Gradient headline */}
            <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              <span
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                From idea to live app
              </span>
              <br />
              <span className="text-gray-900">in 60 seconds</span>
            </h1>

            {/* Animated subtitle with cycling business types */}
            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Whether you&apos;re a{' '}
              <span className="font-semibold text-gray-800">
                <BusinessTypeCycler />
              </span>
              {' '}— describe what you need and we&apos;ll build, host, and launch your app. No code required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button size="xl" asChild className="text-base font-semibold">
                <Link href="/build">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="ghost" asChild className="text-base">
                <a href="#how-it-works">See it live ↓</a>
              </Button>
            </div>

            {/* Activity ticker */}
            <div className="mt-8">
              <ActivityTicker />
            </div>
          </div>

          {/* Right — live app cards */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl -z-10" />
            <div className="p-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Apps built by real businesses</p>
              <AppCardPreview />
              <div className="mt-4 bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-base">🎉</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Morning Flow Workshop</p>
                  <p className="text-xs text-emerald-600 font-medium">Just went live · 3 registrations in 10 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-900 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Three steps. That&apos;s it.</h2>
            <p className="text-lg text-gray-500 max-w-md mx-auto">No tutorials, no technical setup, no developer needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-gray-300 text-2xl -translate-y-1/2 z-10">→</div>
                )}
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Step {step.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's actually built */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Not just a website</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">A real working app</h2>
            <p className="text-lg text-gray-500 max-w-lg mx-auto">Every app we build has a live database, working forms, email notifications, and an admin panel — out of the box.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '💾', title: 'Real Database', body: 'Form submissions save to a live database. No spreadsheets needed.', color: 'bg-blue-50 border-blue-100' },
              { icon: '📧', title: 'Email Alerts', body: 'Get notified instantly every time someone books, registers, or signs up.', color: 'bg-green-50 border-green-100' },
              { icon: '📊', title: 'Admin Dashboard', body: 'See all your bookings and submissions in one place. Confirm or decline with one click.', color: 'bg-purple-50 border-purple-100' },
              { icon: '📱', title: 'QR Code', body: 'Every app comes with a downloadable QR code — perfect for flyers, receipts, and storefronts.', color: 'bg-orange-50 border-orange-100' },
              { icon: '🎨', title: 'Brand Colors', body: "Pick your brand color and your entire app updates instantly — before you even deploy.", color: 'bg-pink-50 border-pink-100' },
              { icon: '📡', title: 'Live Preview', body: "Watch your app take shape in real time as you answer each question.", color: 'bg-indigo-50 border-indigo-100' },
              { icon: '🔒', title: 'Secure by Default', body: "HTTPS everywhere. Form data is encrypted in transit and at rest.", color: 'bg-gray-50 border-gray-200' },
              { icon: '🌍', title: 'Global CDN', body: "Deployed to Vercel's edge network. Fast for customers anywhere.", color: 'bg-teal-50 border-teal-100' },
            ].map(f => (
              <div key={f.title} className={`rounded-xl border p-5 ${f.color}`}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6" id="templates">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Templates</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Built for real businesses</h2>
            <p className="text-lg text-gray-500">Pick a starting point or just describe your problem — we&apos;ll figure out the right one.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATES.map(t => (
              <Link
                key={t.title}
                href={`/build?template=${t.title.toLowerCase().replace(/ /g, '_')}`}
                className={`group bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{t.icon}</div>
                  {t.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{t.desc}</p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  Build this app →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black text-gray-900">Real businesses. Real results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Your customers are waiting.<br />Build your app now.
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of small business owners who built their app in under 3 minutes — no developer, no waiting, no code.
          </p>
          <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-base" asChild>
            <Link href="/build">
              Build My Free App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Live in 60 seconds</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Secure by default</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="font-black text-white">VibeDeploy</span>
              <span className="text-gray-500 text-sm ml-2">From idea to live app in 60 seconds.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/build" className="hover:text-gray-300 transition-colors">Build</Link>
              <Link href="/gallery" className="hover:text-gray-300 transition-colors">Gallery</Link>
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <a href="#templates" className="hover:text-gray-300 transition-colors">Templates</a>
              <span className="text-gray-700">·</span>
              <span>© 2026 VibeDeploy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
