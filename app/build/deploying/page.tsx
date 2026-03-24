'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

const STEPS = [
  { label: 'Understanding your requirements', icon: '🧠' },
  { label: 'Writing custom copy with AI', icon: '✍️' },
  { label: 'Building your app', icon: '🔧' },
  { label: 'Setting up your database', icon: '💾' },
  { label: 'Deploying to the web', icon: '🚀' },
  { label: 'Configuring your URL', icon: '🌐' },
]

const MESSAGES = [
  'Crafting your unique headlines...',
  'Building a beautiful booking page...',
  'Setting up form submissions...',
  'Configuring email notifications...',
  'Making everything mobile-friendly...',
  'Adding your business details...',
  'Running final quality checks...',
  'Polishing the design...',
  'Almost there!',
]

export default function DeployingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [messageIndex, setMessageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Cycle friendly messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  // Smooth progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (completedSteps.length >= STEPS.length) return 100
        const target = (completedSteps.length / STEPS.length) * 90 + 5
        return Math.min(p + 0.8, target)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [completedSteps])

  useEffect(() => {
    const deploy = async () => {
      try {
        const raw = sessionStorage.getItem('vibedeploy_config')
        if (!raw) { router.push('/build'); return }
        const config = JSON.parse(raw)

        // Steps 0-1: visual progress
        for (let i = 0; i <= 1; i++) {
          await new Promise(r => setTimeout(r, 800))
          setCompletedSteps(p => [...p, i])
          setCurrentStep(i + 1)
        }

        // Step 2: Generate (with AI copy)
        setCurrentStep(2)
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        })
        const genData = await genRes.json()
        if (!genRes.ok) throw new Error(genData.error || 'Generation failed')

        setCompletedSteps(p => [...p, 2])
        setCurrentStep(3)
        await new Promise(r => setTimeout(r, 600))
        setCompletedSteps(p => [...p, 3])
        setCurrentStep(4)

        // Step 4: Deploy
        const depRes = await fetch('/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain: genData.subdomain, files: genData.files }),
        })
        const depData = await depRes.json()
        if (!depRes.ok) throw new Error(depData.error || 'Deployment failed')

        setCompletedSteps(p => [...p, 4])
        setCurrentStep(5)
        await new Promise(r => setTimeout(r, 700))
        setCompletedSteps(p => [...p, 5])
        setProgress(100)

        // Store result and redirect
        const projectName = genData.name || config.answers?.businessName || 'My App'
        sessionStorage.setItem('vibedeploy_result', JSON.stringify({
          url: depData.url,
          name: projectName,
          templateType: config.templateType,
          projectId: genData.projectId,
        }))

        await new Promise(r => setTimeout(r, 500))
        router.push('/build/success')
      } catch (err: unknown) {
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
          <button
            onClick={() => router.push('/build')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-r-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4" style={{ animation: 'float 2s ease-in-out infinite' }}>🚀</div>
              <h2 className="text-2xl font-black text-gray-900">Building your app</h2>
              <p className="text-gray-500 text-sm mt-2">This usually takes 30–60 seconds</p>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-8">
              {STEPS.map((step, i) => {
                const isDone = completedSteps.includes(i)
                const isCurrent = currentStep === i && !isDone
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isCurrent ? 'bg-blue-50' : isDone ? 'bg-emerald-50/50' : ''}`}
                  >
                    <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                    <span className="text-sm flex items-center gap-2">
                      <span>{step.icon}</span>
                      <span className={isDone ? 'text-emerald-700 font-medium' : isCurrent ? 'text-blue-700 font-medium' : 'text-gray-400'}>
                        {step.label}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Rotating message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-3 text-center border border-blue-100/50">
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

        {/* Reassurance */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Your app is being built with care ✨
        </p>
      </div>
    </div>
  )
}
