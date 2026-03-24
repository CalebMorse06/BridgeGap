'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send, PanelRightClose, PanelRightOpen, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatMessage, TypingIndicator } from '@/components/build/chat-message'
import { QuickReplies } from '@/components/build/quick-replies'
import { IntegrationPanel, INTEGRATIONS_CONFIG } from '@/components/build/integration-panel'
import { LivePreview } from '@/components/build/live-preview'
import {
  type Message,
  type TemplateType,
  type Integration,
  TEMPLATE_QUESTIONS,
  detectTemplate,
  getQuickRepliesForStep,
} from '@/types'
import { slugify } from '@/lib/utils'

const TEMPLATE_LABELS: Record<string, string> = {
  service_booking: '🔧 Service Booking',
  restaurant_menu: '🍕 Restaurant Menu',
  event_registration: '🎉 Event Registration',
  waitlist: '📋 Waitlist',
  portfolio: '🎨 Portfolio',
  donation: '❤️ Donation / Fundraiser',
}

// Color presets for brand customization
const BRAND_COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Indigo', value: '#4f46e5' },
]

function BuildPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTemplate = searchParams.get('template') as TemplateType

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [templateType, setTemplateType] = useState<TemplateType>(initialTemplate || null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'chat' | 'integrations'>('chat')
  const [showPreview, setShowPreview] = useState(false)
  const [brandColor, setBrandColor] = useState('#2563eb')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>(
    INTEGRATIONS_CONFIG.map(i => ({ type: i.id, enabled: i.defaultEnabled, useOwnKeys: false }))
  )
  const [isListening, setIsListening] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check voice support
  useEffect(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    setIsVoiceSupported(!!SR)
  }, [])

  // Initial greeting
  useEffect(() => {
    if (initialTemplate && TEMPLATE_QUESTIONS[initialTemplate]) {
      const q = TEMPLATE_QUESTIONS[initialTemplate][0]
      setMessages([{
        id: '1',
        role: 'ai',
        content: `Great choice — let's build your ${TEMPLATE_LABELS[initialTemplate]}. I just need a few quick details.\n\n${q.question}${q.suggestion ? `\n\n💡 ${q.suggestion}` : ''}`,
        timestamp: new Date(),
        quickReplies: q.quickReplies || [],
      }])
    } else {
      setMessages([{
        id: '1',
        role: 'ai',
        content: "Hey! 👋 Tell me about your business or what you're trying to solve — I'll build you a real working app.\n\nFor example:\n• \"I'm a plumber and need customers to book online\"\n• \"I need a menu website for my taco shop\"\n• \"I want to sell tickets for my yoga workshop\"",
        timestamp: new Date(),
        quickReplies: [],
      }])
    }
  }, [initialTemplate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-show preview once we have a template + some answers
  useEffect(() => {
    if (templateType && Object.keys(answers).length >= 1 && !showPreview) {
      const t = setTimeout(() => setShowPreview(true), 700)
      return () => clearTimeout(t)
    }
  }, [templateType, answers, showPreview])

  const addMessage = useCallback((role: 'ai' | 'user', content: string, quickReplies: string[] = []) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      role, content, timestamp: new Date(), quickReplies,
    }])
  }, [])

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || isTyping) return
    setInput('')
    addMessage('user', msg)
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 550 + Math.random() * 350))

    if (!templateType) {
      const detected = detectTemplate(msg)
      if (detected) {
        setTemplateType(detected)
        const firstQ = TEMPLATE_QUESTIONS[detected][0]
        const qr = firstQ.quickReplies || []
        setIsTyping(false)
        addMessage('ai',
          `Perfect — a ${TEMPLATE_LABELS[detected]} is exactly what you need! Let me get a few quick details.\n\n${firstQ.question}${firstQ.suggestion ? `\n\n💡 ${firstQ.suggestion}` : ''}`,
          qr
        )
      } else {
        setIsTyping(false)
        // Try AI detection as fallback
        try {
          const res = await fetch('/api/detect-template', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg }),
          })
          const data = await res.json()
          if (data.template && TEMPLATE_QUESTIONS[data.template]) {
            setTemplateType(data.template as TemplateType)
            const firstQ = TEMPLATE_QUESTIONS[data.template][0]
            setIsTyping(false)
            addMessage('ai',
              `I think a ${TEMPLATE_LABELS[data.template]} would be perfect for that! Let me get some details.\n\n${firstQ.question}${firstQ.suggestion ? `\n\n💡 ${firstQ.suggestion}` : ''}`,
              firstQ.quickReplies || []
            )
            return
          }
        } catch {}

        setIsTyping(false)
        addMessage('ai', "I can help! What kind of app do you need? Pick the closest one:", [
          '📅 Booking / appointments',
          '🍕 Restaurant menu',
          '🎉 Event registration',
          '📋 Waitlist / signups',
          '🎨 Portfolio / freelancer',
          '❤️ Donation / fundraiser',
        ])
      }
      return
    }

    const questions = TEMPLATE_QUESTIONS[templateType]
    if (!questions) return
    const currentQ = questions[questionIndex]
    const newAnswers = { ...answers, [currentQ.key]: msg }
    setAnswers(newAnswers)

    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex)
      const nextQ = questions[nextIndex]
      const encouragements = ['Got it!', 'Perfect!', 'Great!', 'Love it!', 'Awesome!', 'Nice!']
      const enc = encouragements[Math.floor(Math.random() * encouragements.length)]
      const isLast = nextIndex === questions.length - 1
      setIsTyping(false)
      addMessage('ai',
        `${enc} ${nextQ.question}${nextQ.suggestion ? `\n\n💡 ${nextQ.suggestion}` : ''}${isLast ? '\n\n(Last question!)' : ''}`,
        nextQ.quickReplies || []
      )
    } else {
      setIsTyping(false)
      setPhase('integrations')
      addMessage('ai', `That's everything I need! 🎉\n\nHere are some optional features you can add to your app. Toggle on what you want — they all work out of the box.`)
    }
  }, [input, isTyping, templateType, questionIndex, answers, addMessage])

  const handleVoice = useCallback(() => {
    const SR = (window as unknown as { new(): SpeechRecognition }).SpeechRecognition || (window as unknown as { new(): SpeechRecognition }).webkitSpeechRecognition
    if (!SR || isListening) return

    setIsListening(true)
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
      setTimeout(() => {
        const el = inputRef.current
        if (el && el.value.trim()) {
          handleSend(el.value)
        }
      }, 1500)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [isListening, handleSend])

  // Handle quick reply chip selection
  const handleQuickReply = useCallback((text: string) => {
    // Map friendly labels back to values
    const templateMap: Record<string, TemplateType> = {
      '📅 Booking / appointments': 'service_booking',
      '🍕 Restaurant menu': 'restaurant_menu',
      '🎉 Event registration': 'event_registration',
      '📋 Waitlist / signups': 'waitlist',
      '🎨 Portfolio / freelancer': 'portfolio',
      '❤️ Donation / fundraiser': 'donation',
    }
    if (templateMap[text]) {
      setTemplateType(templateMap[text])
      const firstQ = TEMPLATE_QUESTIONS[templateMap[text]!]?.[0]
      if (firstQ) {
        addMessage('user', text)
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          addMessage('ai',
            `Great! Let's build your ${TEMPLATE_LABELS[templateMap[text]!]}.\n\n${firstQ.question}${firstQ.suggestion ? `\n\n💡 ${firstQ.suggestion}` : ''}`,
            firstQ.quickReplies || []
          )
        }, 600)
      }
    } else {
      handleSend(text)
    }
  }, [addMessage, handleSend])

  const handleDeploy = () => {
    const subdomain = slugify(answers.businessName || answers.eventName || answers.waitlistFor || answers.yourName || 'myapp')
    const config = { templateType, answers: { ...answers, brandColor }, integrations: integrations.filter(i => i.enabled).map(i => i.type) }
    sessionStorage.setItem('vibedeploy_config', JSON.stringify(config))
    router.push('/build/deploying')
  }

  const subdomain = slugify(answers.businessName || answers.eventName || answers.waitlistFor || answers.yourName || '')
  const totalQ = templateType ? TEMPLATE_QUESTIONS[templateType]?.length ?? 0 : 0
  const answeredQ = Object.keys(answers).length
  const progress = totalQ ? Math.round((answeredQ / totalQ) * 100) : 0
  const lastMsg = messages[messages.length - 1]
  const currentQR = phase === 'chat' && lastMsg?.role === 'ai' ? (lastMsg.quickReplies || []) : []

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Layout CSS injected directly to avoid Turbopack tree-shaking */}
      <style>{`
        @keyframes micPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.2)} }
        .build-chat-pane { width: 100%; }
        .build-preview-pane { display: none; flex: 1; min-width: 0; flex-direction: column; }
        .build-preview-mobile { display: block; }
        @media (min-width: 1024px) {
          .build-chat-pane { width: 460px; }
          .build-preview-pane { display: flex; }
          .build-preview-mobile { display: none !important; }
        }
        .demo-chat-pane { width: 100%; }
        .demo-preview-pane { display: none; flex: 1; }
        @media (min-width: 1024px) {
          .demo-chat-pane { width: 460px; }
          .demo-preview-pane { display: flex; }
        }
      `}</style>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 shrink-0 z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-lg">✨</span>
            <span className="font-semibold text-gray-900 text-sm hidden sm:block">VibeDeploy</span>
            {templateType && (
              <>
                <span className="text-gray-200">/</span>
                <Badge variant="outline" className="text-xs">{TEMPLATE_LABELS[templateType]}</Badge>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Brand color picker */}
            {templateType && (
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  title="Brand color"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm" style={{ background: brandColor }} />
                  <span className="hidden sm:block">Brand Color</span>
                </button>
                {showColorPicker && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Pick your brand color</p>
                    <div className="grid grid-cols-4 gap-2">
                      {BRAND_COLORS.map(c => (
                        <button
                          key={c.value}
                          onClick={() => { setBrandColor(c.value); setShowColorPicker(false) }}
                          className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                          style={{ background: c.value, borderColor: brandColor === c.value ? '#111827' : 'transparent' }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress */}
            {templateType && phase === 'chat' && totalQ > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <span>{answeredQ}/{totalQ}</span>
              </div>
            )}

            {/* Preview toggle */}
            {templateType && (
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 hidden lg:inline-flex" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat column */}
        <div className={`flex flex-col min-w-0 transition-all duration-300 ${showPreview ? 'build-chat-pane flex-none border-r border-gray-200' : 'flex-1'}`}>
          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="max-w-lg mx-auto lg:mx-0">
              {messages.map((m, i) => (
                <div key={m.id}>
                  <ChatMessage message={m} />
                  {/* Show quick replies only after last AI message */}
                  {m.role === 'ai' && i === messages.length - 1 && phase === 'chat' && (m.quickReplies || []).length > 0 && (
                    <QuickReplies options={m.quickReplies!} onSelect={handleQuickReply} />
                  )}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              {phase === 'integrations' && (
                <div className="mt-2">
                  <IntegrationPanel
                    integrations={integrations}
                    onToggle={(i, enabled) => setIntegrations(prev => prev.map((int, idx) => idx === i ? { ...int, enabled } : int))}
                    onDeploy={handleDeploy}
                    subdomain={subdomain}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          {phase === 'chat' && (
            <div className="bg-white border-t border-gray-100 px-4 py-3 sm:px-5 shrink-0">
              <div className="max-w-lg mx-auto lg:mx-0 flex gap-2.5 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={!templateType ? "Describe your business or problem..." : "Type your answer..."}
                  className="flex-1 h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                  autoFocus
                />
                {isVoiceSupported && (
                  <button
                    onClick={handleVoice}
                    className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
                    title={isListening ? 'Listening...' : 'Voice input'}
                    type="button"
                    style={isListening ? { animation: 'micPulse 1s ease-in-out infinite', background: '#fee2e2', borderColor: '#fca5a5' } : {}}
                  >
                    {isListening ? (
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                    ) : (
                      <span className="text-lg">🎙️</span>
                    )}
                  </button>
                )}
                <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping} size="icon" className="h-11 w-11 rounded-xl shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile preview toggle */}
          {templateType && (
            <div className="lg:hidden px-4 py-2 bg-white border-t border-gray-100 shrink-0">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-3.5 w-3.5" />
                {showPreview ? 'Back to Chat' : 'Preview Your App'}
              </Button>
            </div>
          )}
        </div>

        {/* Preview panel — desktop side-by-side, mobile full-screen overlay */}
        {showPreview && (
          <div className="build-preview-pane bg-gray-100">
            <div className="h-full p-3" style={{padding: '20px'}}>
              <LivePreview
                templateType={templateType}
                answers={{ ...answers, brandColor }}
                className="h-full"
              />
            </div>
          </div>
        )}
        {/* Mobile preview overlay (only on small screens) */}
        {showPreview && (
          <div className="build-preview-mobile fixed inset-0 bg-gray-100 z-20" style={{top: '56px'}}>
            <div className="h-full p-3">
              <LivePreview
                templateType={templateType}
                answers={{ ...answers, brandColor }}
                className="h-full"
              />
            </div>
            <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md border border-gray-200">
              <PanelRightClose className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuildPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">✨</div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <BuildPageInner />
    </Suspense>
  )
}
