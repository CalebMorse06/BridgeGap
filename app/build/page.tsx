'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  type Message,
  type TemplateType,
  type Integration,
  TEMPLATE_QUESTIONS,
  detectTemplate,
} from '@/types'

const TEMPLATE_LABELS: Record<string, string> = {
  service_booking: '🔧 Service Booking',
  restaurant_menu: '🍕 Restaurant Menu',
  event_registration: '🎉 Event Registration',
  waitlist: '📋 Waitlist',
}

const INTEGRATIONS_CONFIG = [
  {
    id: 'stripe' as const,
    icon: '💳',
    title: 'Accept Payments',
    description: 'Let customers pay deposits or full amounts when they book or register.',
    defaultEnabled: false,
    badge: 'Test mode',
    badgeVariant: 'default' as const,
  },
  {
    id: 'twilio' as const,
    icon: '📱',
    title: 'SMS Notifications',
    description: 'Send booking confirmations and reminders via text message.',
    defaultEnabled: false,
    badge: 'Test mode',
    badgeVariant: 'default' as const,
  },
  {
    id: 'resend' as const,
    icon: '📧',
    title: 'Email Notifications',
    description: "Get an email every time someone books, registers, or joins your waitlist.",
    defaultEnabled: true,
    badge: 'Free',
    badgeVariant: 'success' as const,
  },
  {
    id: 'analytics' as const,
    icon: '📊',
    title: 'Basic Analytics',
    description: 'See how many people visit your app and track conversions.',
    defaultEnabled: true,
    badge: 'Free',
    badgeVariant: 'success' as const,
  },
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shrink-0">✨</div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              style={{
                animation: 'bounceDot 1.4s infinite',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isAI = message.role === 'ai'
  return (
    <div
      className={`flex items-end gap-3 mb-4 ${isAI ? '' : 'flex-row-reverse'}`}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shrink-0">✨</div>
      )}
      <div
        className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isAI
            ? 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
            : 'bg-blue-600 text-white rounded-br-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

export default function BuildPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hi! I'm here to help you build your app. 👋\n\nFirst — tell me a bit about your business or what you're trying to solve. What do you do?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [templateType, setTemplateType] = useState<TemplateType>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'chat' | 'integrations'>('chat')
  const [integrations, setIntegrations] = useState<Integration[]>(
    INTEGRATIONS_CONFIG.map((i) => ({
      type: i.id,
      enabled: i.defaultEnabled,
      useOwnKeys: false,
    }))
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const totalQuestions = templateType ? TEMPLATE_QUESTIONS[templateType]?.length ?? 0 : 0

  const addMessage = useCallback((role: 'ai' | 'user', content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, content, timestamp: new Date() },
    ])
  }, [])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    addMessage('user', text)
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 800))

    // Phase 1: detect template
    if (!templateType) {
      const detected = detectTemplate(text)
      if (detected) {
        setTemplateType(detected)
        const firstQ = TEMPLATE_QUESTIONS[detected][0]
        setIsTyping(false)
        addMessage(
          'ai',
          `Great! I can build you a ${TEMPLATE_LABELS[detected]} — that's perfect for what you're describing. Let's get the details.\n\n${firstQ.question}${firstQ.suggestion ? `\n\n(${firstQ.suggestion})` : ''}`
        )
      } else {
        setIsTyping(false)
        addMessage(
          'ai',
          "That sounds interesting! Could you tell me a bit more? For example — do you need people to book appointments, see a menu, register for an event, or join a waitlist?"
        )
      }
      return
    }

    // Phase 2: answer questions
    const questions = TEMPLATE_QUESTIONS[templateType]
    const currentQ = questions[questionIndex]
    const newAnswers = { ...answers, [currentQ.key]: text }
    setAnswers(newAnswers)

    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex)
      const nextQ = questions[nextIndex]
      setIsTyping(false)
      const encouragements = ['Perfect!', 'Got it!', 'Great!', 'Awesome!', 'Love it!']
      const enc = encouragements[questionIndex % encouragements.length]
      addMessage('ai', `${enc} ${nextQ.question}${nextQ.suggestion ? `\n\n(${nextQ.suggestion})` : ''}`)
    } else {
      // All questions answered
      setIsTyping(false)
      setPhase('integrations')
      addMessage(
        'ai',
        `Amazing! I have everything I need. 🎉\n\nNow let me show you some optional features you can add to your app. Toggle on anything that sounds useful — they're all set up and ready to go.`
      )
    }
  }, [input, isTyping, templateType, questionIndex, answers, addMessage])

  const handleDeploy = () => {
    const config = {
      templateType,
      answers,
      integrations: integrations.filter((i) => i.enabled).map((i) => i.type),
    }
    sessionStorage.setItem('vibedeploy_config', JSON.stringify(config))
    router.push('/build/deploying')
  }

  const progress = templateType
    ? Math.round(((questionIndex) / (TEMPLATE_QUESTIONS[templateType]?.length ?? 1)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span className="font-semibold text-gray-900">VibeDeploy</span>
          </div>
          {templateType && phase === 'chat' && (
            <div className="flex items-center gap-3">
              <Badge variant="outline">{TEMPLATE_LABELS[templateType]}</Badge>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{questionIndex}/{TEMPLATE_QUESTIONS[templateType]?.length}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {phase === 'chat' ? (
        <>
          {/* Chat */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-2xl">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-2xl flex gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={
                  !templateType
                    ? "Tell me about your business..."
                    : templateType && questionIndex < (TEMPLATE_QUESTIONS[templateType]?.length ?? 0)
                    ? "Type your answer..."
                    : "Type here..."
                }
                className="flex-1 h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                autoFocus
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-12 w-12 rounded-xl shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Integrations Phase */
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-2xl">
            {/* Show last few messages */}
            {messages.slice(-2).map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {/* Integration cards */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-4">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">⚡ Optional Features</h3>
                <p className="text-sm text-gray-500 mt-0.5">Toggle on anything you'd like. You can always change these later.</p>
              </div>

              <div className="divide-y divide-gray-100">
                {INTEGRATIONS_CONFIG.map((intConfig, i) => {
                  const integration = integrations[i]
                  return (
                    <div key={intConfig.id} className="flex items-start gap-4 px-6 py-4">
                      <div className="text-2xl mt-0.5">{intConfig.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm text-gray-900">{intConfig.title}</span>
                          <Badge variant={intConfig.badgeVariant} className="text-xs">
                            {intConfig.badge}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{intConfig.description}</p>
                      </div>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(checked) => {
                          setIntegrations((prev) =>
                            prev.map((int, idx) => (idx === i ? { ...int, enabled: checked } : int))
                          )
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Deploy button */}
            <div className="mt-6">
              <Button size="xl" className="w-full text-base" onClick={handleDeploy}>
                Generate & Deploy My App
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Your app will be live at{' '}
                <span className="font-medium text-gray-600">
                  {answers.businessName
                    ? `${answers.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.vibedeploy.app`
                    : 'yourapp.vibedeploy.app'}
                </span>{' '}
                in about 30 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
