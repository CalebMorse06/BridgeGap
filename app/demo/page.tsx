'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Play, Pause, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LivePreview } from '@/components/build/live-preview'

/**
 * Demo page — judges and visitors can watch VibeDeploy build an app in real time
 * with pre-filled answers that auto-type, showing the full flow.
 */

const DEMO_SCENARIO = {
  templateType: 'service_booking' as const,
  label: "Bob's Plumbing",
  steps: [
    { key: 'businessName', answer: "Bob's Plumbing", delay: 60 },
    { key: 'services', answer: 'Drain cleaning, pipe repair, water heater installation, emergency plumbing', delay: 40 },
    { key: 'hours', answer: 'Mon–Sat 7am–6pm', delay: 70 },
    { key: 'location', answer: 'Austin, TX metro area', delay: 60 },
    { key: 'collectDeposits', answer: 'No, I\'ll collect payment in person', delay: 80 },
    { key: 'contactEmail', answer: 'bob@bobsplumbing.com', delay: 50 },
  ],
}

interface DemoMessage {
  role: 'ai' | 'user'
  text: string
}

export default function DemoPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [stepIndex, setStepIndex] = useState(-1)
  const [typing, setTyping] = useState('')
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro')
  const [paused, setPaused] = useState(false)

  const addMsg = useCallback((role: 'ai' | 'user', text: string) => {
    setMessages(prev => [...prev, { role, text }])
  }, [])

  // Run the demo
  useEffect(() => {
    if (phase !== 'running' || paused) return
    if (stepIndex < 0) {
      // Initial AI message
      addMsg('ai', "Hey! 👋 Tell me about your business — I'll build you a real working app.")
      setTimeout(() => {
        addMsg('user', "I'm a plumber in Austin and need customers to book appointments online")
        setTimeout(() => {
          addMsg('ai', "Perfect — a Service Booking app is exactly what you need! Let me get some details.\n\nWhat's your business called?")
          setStepIndex(0)
        }, 800)
      }, 1200)
      return
    }

    if (stepIndex >= DEMO_SCENARIO.steps.length) {
      setPhase('done')
      return
    }

    const step = DEMO_SCENARIO.steps[stepIndex]

    // Type the answer character by character
    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (paused) return
      charIndex++
      if (charIndex <= step.answer.length) {
        setTyping(step.answer.slice(0, charIndex))
      } else {
        clearInterval(typeInterval)
        setTyping('')
        addMsg('user', step.answer)
        setAnswers(prev => ({ ...prev, [step.key]: step.answer }))

        // AI responds
        setTimeout(() => {
          const nextIdx = stepIndex + 1
          if (nextIdx < DEMO_SCENARIO.steps.length) {
            const encouragements = ['Got it!', 'Perfect!', 'Great!', 'Love it!', 'Nice!']
            const enc = encouragements[stepIndex % encouragements.length]
            const questions: Record<string, string> = {
              services: 'What services do you offer?',
              hours: 'What days and hours do you typically work?',
              location: 'What city or area do you serve?',
              collectDeposits: 'Would you like customers to pay a deposit when they book?',
              contactEmail: "Last one — what's your email for booking notifications?",
            }
            const nextKey = DEMO_SCENARIO.steps[nextIdx].key
            addMsg('ai', `${enc} ${questions[nextKey] || 'Next question...'}`)
          } else {
            addMsg('ai', "That's everything! 🎉 Your app is ready to deploy.")
          }
          setStepIndex(nextIdx)
        }, 600)
      }
    }, step.delay)

    return () => clearInterval(typeInterval)
  }, [phase, stepIndex, paused, addMsg])

  // Auto-scroll
  useEffect(() => {
    const el = document.getElementById('demo-chat-end')
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">VibeDeploy Demo</h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Watch VibeDeploy build a real booking app for a plumber in Austin — from conversation to live app in under 60 seconds.
          </p>
          <Button size="xl" onClick={() => { setPhase('running'); setStepIndex(-1) }} className="text-base font-semibold">
            <Play className="mr-2 h-5 w-5" />
            Start Demo
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Or <Link href="/build" className="text-blue-600 font-medium hover:underline">build your own app →</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-2.5 shrink-0 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">✨</span>
            <span className="font-semibold text-gray-900 text-sm">VibeDeploy</span>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Demo Mode</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={() => setPaused(!paused)}>
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button size="sm" className="text-xs" asChild>
              <Link href="/build">Build My Own →</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className="w-full lg:w-[440px] lg:border-r lg:border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2.5 mb-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animation: 'fadeIn 0.25s ease-out' }}>
                {m.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs shrink-0">✨</div>
                )}
                <div className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm whitespace-pre-line ${
                  m.role === 'ai'
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md'
                    : 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2.5 mb-3 flex-row-reverse">
                <div className="max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm bg-blue-600 text-white rounded-2xl rounded-br-md">
                  {typing}<span className="inline-block w-0.5 h-4 bg-white/50 ml-0.5 animate-pulse align-text-bottom" />
                </div>
              </div>
            )}
            <div id="demo-chat-end" />

            {phase === 'done' && (
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 text-center" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <p className="text-3xl mb-3">🎉</p>
                <p className="font-bold text-gray-900 mb-2">Demo complete!</p>
                <p className="text-sm text-gray-500 mb-4">That's how fast it is. Now build your own.</p>
                <Button asChild>
                  <Link href="/build">
                    Build My App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Fake input (disabled in demo) */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
            <div className="flex gap-2.5">
              <input
                disabled
                placeholder="Demo is running automatically..."
                className="flex-1 h-11 rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="hidden lg:block flex-1 p-5 bg-gray-100">
          <LivePreview
            templateType={DEMO_SCENARIO.templateType}
            answers={answers}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
