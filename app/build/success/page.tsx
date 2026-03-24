'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Copy, ExternalLink, CheckCircle, ArrowRight, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const router = useRouter()
  const [result, setResult] = useState<{ url: string; name: string; templateType: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('vibedeploy_result')
    if (!raw) {
      router.push('/build')
      return
    }
    setResult(JSON.parse(raw))
  }, [router])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(`https://${result.url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4" style={{ animation: 'slideUp 0.5s ease-out' }}>
            🎉
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
            Your app is live!
          </h1>
          <p className="text-gray-500" style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
            {result.name} is ready for your customers.
          </p>
        </div>

        {/* URL card */}
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6"
          style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-600">Live now</span>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-mono text-gray-900 truncate">
              https://{result.url}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1" asChild>
              <a href={`https://${result.url}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Your App
              </a>
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={handleCopy}>
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* What's next */}
        <div
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
          style={{ animation: 'slideUp 0.5s ease-out 0.4s both' }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">What's next?</h3>
          <div className="space-y-3">
            {[
              { icon: '📱', text: 'Share the link with your customers via text or email' },
              { icon: '📊', text: 'Check your dashboard to see visitors and bookings' },
              { icon: '✏️', text: 'Edit your app anytime from the dashboard' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-base">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
