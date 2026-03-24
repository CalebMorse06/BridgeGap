'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

const STEPS = [
  { label: 'Understanding your requirements', message: 'Reading through what you told us...' },
  { label: 'Designing your app', message: 'Creating the perfect layout for your business...' },
  { label: 'Building your features', message: 'Setting up your booking system and forms...' },
  { label: 'Deploying to the web', message: 'Launching your app on our servers...' },
  { label: 'Setting up your URL', message: 'Finalizing your personal app address...' },
]

const MESSAGES = [
  'Building your booking calendar...',
  'Setting up your contact forms...',
  'Adding your business details...',
  'Making everything look polished...',
  'Running final checks...',
  'Almost ready!',
]

export default function DeployingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cycle through friendly messages
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length)
    }, 2500)
    return () => clearInterval(msgInterval)
  }, [])

  useEffect(() => {
    const deploy = async () => {
      try {
        const raw = sessionStorage.getItem('vibedeploy_config')
        if (!raw) {
          router.push('/build')
          return
        }
        const config = JSON.parse(raw)

        // Step 0-1: visual progress
        for (let i = 0; i <= 1; i++) {
          await new Promise((r) => setTimeout(r, 900))
          setCompletedSteps((p) => [...p, i])
          setCurrentStep(i + 1)
        }

        // Step 2: Generate app
        setCurrentStep(2)
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        })
        const genData = await genRes.json()
        if (!genRes.ok) throw new Error(genData.error || 'Generation failed')

        setCompletedSteps((p) => [...p, 2])
        setCurrentStep(3)

        // Step 3: Deploy
        const depRes = await fetch('/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subdomain: genData.subdomain,
            files: genData.files,
          }),
        })
        const depData = await depRes.json()
        if (!depRes.ok) throw new Error(depData.error || 'Deployment failed')

        setCompletedSteps((p) => [...p, 3])
        setCurrentStep(4)
        await new Promise((r) => setTimeout(r, 1000))
        setCompletedSteps((p) => [...p, 4])

        // Store result and redirect
        const projectName = config.answers?.businessName || config.answers?.eventName || 'My App'
        sessionStorage.setItem('vibedeploy_result', JSON.stringify({
          url: depData.url,
          name: projectName,
          templateType: config.templateType,
        }))

        await new Promise((r) => setTimeout(r, 600))
        router.push('/build/success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setError(message)
      }
    }

    deploy()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/build')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-bounce">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900">Building your app</h2>
          <p className="text-gray-500 text-sm mt-2">Usually takes about 30–60 seconds</p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i)
            const isCurrent = currentStep === i && !isDone
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isDone ? 'text-emerald-600 font-medium' : isCurrent ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Friendly rotating message */}
        <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
          <p className="text-sm text-blue-700 font-medium" key={messageIndex} style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {MESSAGES[messageIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}
