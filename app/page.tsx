'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BUSINESS_TYPES = ['plumber', 'restaurant', 'yoga studio', 'nonprofit', 'photographer']

const TEMPLATES = [
  { title: 'Service Booking', desc: 'Plumbers, cleaners, photographers, coaches — let customers book you online.', color: 'from-blue-50 to-blue-100/50', border: 'border-blue-200', badge: 'Most popular', badgeColor: 'bg-blue-600 text-white' },
  { title: 'Restaurant Menu', desc: 'Beautiful menu site with hours, location, and optional online ordering.', color: 'from-orange-50 to-orange-100/50', border: 'border-orange-200', badge: '', badgeColor: '' },
  { title: 'Event Registration', desc: 'Workshops, classes, concerts — collect RSVPs and sell tickets.', color: 'from-green-50 to-green-100/50', border: 'border-green-200', badge: '', badgeColor: '' },
  { title: 'Waitlist Manager', desc: 'Manage limited spots and auto-notify people when they get in.', color: 'from-purple-50 to-purple-100/50', border: 'border-purple-200', badge: '', badgeColor: '' },
  { title: 'Portfolio', desc: 'Freelancers and creatives — showcase work, collect leads.', color: 'from-indigo-50 to-indigo-100/50', border: 'border-indigo-200', badge: 'New', badgeColor: 'bg-indigo-500 text-white' },
  { title: 'Donation Page', desc: 'Nonprofits and causes — fundraising with a goal tracker.', color: 'from-red-50 to-red-100/50', border: 'border-red-200', badge: 'New', badgeColor: 'bg-red-500 text-white' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Describe what you need', body: 'Tell us about your business in plain language. No technical words required.' },
  { step: '02', title: 'We build your website', body: 'AI creates a complete, working site: forms, pages, styling — the real thing.' },
  { step: '03', title: 'Go live instantly', body: 'Your site deploys to a real URL. Share it, print a QR code, add it to Google Business.' },
]

const TESTIMONIALS = [
  { quote: "Had my booking page up in 3 minutes. My wife thought I hired a developer.", name: 'Bob M.', biz: 'Early user · Plumbing business', stars: 5 },
  { quote: "Finally got off Yelp. My menu site looks more professional than competitors.", name: 'Sarah C.', biz: 'Early user · Restaurant owner', stars: 5 },
  { quote: "Sold out my yoga workshop the same day I launched. Customers could actually register.", name: 'Maya J.', biz: 'Early user · Yoga studio', stars: 5 },
]

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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-black text-gray-900">BridgeGap</span>
            <div className="flex items-center gap-6">
              <Link href="/gallery" className="hidden sm:inline text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors">Gallery</Link>
              <Button size="sm" asChild>
                <Link href="/build">
                  Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Now in public beta
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-gray-900">A real website for your </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <BusinessTypeCycler />
            </span>
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto">
            Describe what you need in plain English. We&apos;ll build it, host it, and make it live. No code, no developers, no waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button size="xl" asChild className="text-base font-semibold">
              <Link href="/build">
                Build your free website
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="ghost" asChild className="text-base">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
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
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-gray-300 text-2xl -translate-y-1/2 z-10">&rarr;</div>
                )}
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">Step {step.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">More than a website</h2>
            <p className="text-lg text-gray-500 max-w-lg mx-auto">Every site we build has working forms, email notifications, and a management dashboard — out of the box.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Working forms', body: 'Submissions save to a live database. No spreadsheets needed.', color: 'bg-blue-50 border-blue-100' },
              { title: 'Email alerts', body: 'Get notified instantly when someone books, registers, or signs up.', color: 'bg-green-50 border-green-100' },
              { title: 'Management dashboard', body: 'See all submissions in one place. Confirm or decline with one click.', color: 'bg-purple-50 border-purple-100' },
              { title: 'QR code included', body: 'Every site comes with a downloadable QR code for flyers, receipts, and storefronts.', color: 'bg-orange-50 border-orange-100' },
              { title: 'Live preview', body: 'Watch your site take shape in real time as you answer each question.', color: 'bg-indigo-50 border-indigo-100' },
              { title: 'Mobile friendly', body: 'Looks great on every device. Tested on phones, tablets, and desktop.', color: 'bg-pink-50 border-pink-100' },
              { title: 'Secure by default', body: 'HTTPS everywhere. Form data is encrypted in transit and at rest.', color: 'bg-gray-50 border-gray-200' },
              { title: 'Fast everywhere', body: "Deployed to a global edge network. Fast for customers anywhere in the world.", color: 'bg-teal-50 border-teal-100' },
            ].map(f => (
              <div key={f.title} className={`rounded-xl border p-5 ${f.color}`}>
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
                  {t.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{t.desc}</p>
                <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                  Build this &rarr;
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
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Early feedback</p>
            <h2 className="text-4xl font-black text-gray-900">What people are saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.biz}</p>
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
            Your customers are searching for you online.
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Give them a real website — not a social media page. Build yours in minutes, for free.
          </p>
          <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-base" asChild>
            <Link href="/build">
              Build your free website
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Free to start</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Secure by default</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-black text-white">BridgeGap</span>
              <span className="text-gray-500 text-sm ml-2">Websites for real businesses.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/build" className="hover:text-gray-300 transition-colors">Build</Link>
              <Link href="/gallery" className="hover:text-gray-300 transition-colors">Gallery</Link>
              <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <span className="text-gray-700">&middot;</span>
              <span>&copy; 2026 BridgeGap</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
