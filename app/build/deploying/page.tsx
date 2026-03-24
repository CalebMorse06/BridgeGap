'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

const PHASES = [
  { key: 'start', label: 'Understanding your requirements' },
  { key: 'generating_copy', label: 'Writing custom copy' },
  { key: 'building_html', label: 'Building your website' },
  { key: 'saving', label: 'Deploying to the web' },
  { key: 'done', label: 'Going live' },
]

const MESSAGES = [
  'Crafting your unique headlines...',
  'Building a beautiful layout...',
  'Setting up form submissions...',
  'Configuring email notifications...',
  'Making it mobile-friendly...',
  'Adding your business details...',
  'Running quality checks...',
  'Almost ready!',
]

export default function DeployingPage() {
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState('start')
  const [completedPhases, setCompletedPhases] = useState<string[]>(['start'])
  const [copyChunks, setCopyChunks] = useState('')
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(8)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  // Cycle friendly messages
  useEffect(() => {
    const i = setInterval(() => setMessageIndex(n => (n + 1) % MESSAGES.length), 2200)
    return () => clearInterval(i)
  }, [])

  // Smooth progress animation
  useEffect(() => {
    const phaseIdx = PHASES.findIndex(p => p.key === currentPhase)
    const target = ((phaseIdx + 1) / PHASES.length) * 92 + 5
    const i = setInterval(() => {
      setProgress(p => {
        const next = p + (target - p) * 0.1
        return Math.min(next, target)
      })
    }, 120)
    return () => clearInterval(i)
  }, [currentPhase])

  useEffect(() => {
    if (started.current) return
    started.current = true

    const deploy = async () => {
      try {
        const raw = sessionStorage.getItem('vibedeploy_config')
        if (!raw) { router.push('/build'); return }
        const config = JSON.parse(raw)

        setCurrentPhase('generating_copy')

        // Use streaming endpoint
        const res = await fetch('/api/stream-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        })

        if (!res.ok || !res.body) throw new Error('Stream failed to start')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let result: { url: string; name: string; projectId: string } | null = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          // Parse SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          let eventType = ''
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim()
            } else if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (eventType === 'status') {
                  setCurrentPhase(data.step)
                  setCompletedPhases(prev => {
                    const idx = PHASES.findIndex(p => p.key === data.step)
                    const completedKeys = PHASES.slice(0, idx).map(p => p.key)
                    return completedKeys
                  })
                } else if (eventType === 'copy_chunk') {
                  setCopyChunks(prev => prev + data.text)
                } else if (eventType === 'done') {
                  result = data
                  setCurrentPhase('done')
                  setCompletedPhases(PHASES.map(p => p.key).slice(0, -1))
                  setProgress(100)
                } else if (eventType === 'error') {
                  throw new Error(data.message)
                }
              } catch (parseErr) {
                // Skip malformed events
              }
              eventType = ''
            }
          }
        }

        if (!result) throw new Error('No deployment result received')

        const projectName = result.name || config.answers?.businessName || 'My App'
        sessionStorage.setItem('vibedeploy_result', JSON.stringify({
          url: result.url,
          name: projectName,
          templateType: config.templateType,
          projectId: result.projectId,
        }))

        await new Promise(r => setTimeout(r, 600))
        router.push('/build/success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    deploy()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{error}</p>
          <button onClick={() => router.push('/build')} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 w-full">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-r-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Building your website</h2>
              <p className="text-gray-500 text-sm mt-1">Usually takes about 15–30 seconds</p>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 mb-6">
              {PHASES.map(phase => {
                const isDone = completedPhases.includes(phase.key)
                const isCurrent = currentPhase === phase.key && !isDone
                return (
                  <div
                    key={phase.key}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isCurrent ? 'bg-blue-50 border border-blue-100' : isDone ? 'opacity-70' : 'opacity-40'
                    }`}
                  >
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                      {isDone
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : isCurrent
                        ? <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                      }
                    </div>
                    <span className={`text-sm ${isDone ? 'text-gray-600' : isCurrent ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>
                      {phase.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* AI writing animation — shows copy being streamed */}
            {copyChunks && (
              <div className="mb-5 bg-gray-50 rounded-xl border border-gray-100 p-3 max-h-16 overflow-hidden relative">
                <p className="text-xs text-gray-500 font-mono leading-relaxed line-clamp-2">
                  {copyChunks}
                  <span className="inline-block w-0.5 h-3 bg-blue-500 ml-0.5 animate-pulse align-text-bottom" />
                </p>
                <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-gray-50 to-transparent rounded-b-xl" />
              </div>
            )}

            {/* Rotating message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 text-center border border-blue-100/60">
              <p
                className="text-sm text-blue-700 font-medium"
                key={messageIndex}
                style={{ animation: 'fadeIn 0.3s ease-out' }}
              >
                {MESSAGES[messageIndex]}
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">This usually takes 15–30 seconds.</p>
      </div>
    </div>
  )
}
