'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Copy, ExternalLink, CheckCircle, ArrowRight, Share2, Download, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TEMPLATE_LABELS: Record<string, { label: string; color: string; nextSteps: string[] }> = {
  service_booking: {
    label: '🔧 Service Booking',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    nextSteps: [
      'Share the link with customers via text or email',
      'Add it to your Google Business profile',
      'Print the QR code and put it on your truck or storefront',
      'Check your dashboard daily for new booking requests',
    ],
  },
  restaurant_menu: {
    label: '🍕 Restaurant Menu',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
    nextSteps: [
      'Share the link on your Instagram and Facebook',
      'Put the QR code on your tables and receipts',
      'Add it to your Google Business listing',
      "Update the menu anytime from your dashboard",
    ],
  },
  event_registration: {
    label: '🎉 Event Registration',
    color: 'text-green-600 bg-green-50 border-green-100',
    nextSteps: [
      'Share the link on social media and email newsletters',
      'Send it directly to people you want to invite',
      'Check your dashboard to see who has registered',
      'Download the QR code for flyers and posters',
    ],
  },
  waitlist: {
    label: '📋 Waitlist',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    nextSteps: [
      'Share the link anywhere people can sign up',
      'Add it to your website or social media bio',
      'Monitor signups in your dashboard',
      'Email your list when spots open up',
    ],
  },
}

export default function SuccessPage() {
  const router = useRouter()
  const [result, setResult] = useState<{ url: string; name: string; templateType: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const confettiRef = useRef<boolean>(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('vibedeploy_result')
    if (!raw) { router.push('/build'); return }
    setResult(JSON.parse(raw))
  }, [router])

  useEffect(() => {
    if (!result || confettiRef.current) return
    confettiRef.current = true

    // Generate QR code client-side
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(`https://${result.url}`, {
        width: 256,
        margin: 2,
        color: { dark: '#111827', light: '#ffffff' },
      }).then(setQrDataUrl).catch(() => {})
    })
  }, [result])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(`https://${result.url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!result) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.name,
          url: `https://${result.url}`,
        })
        return
      } catch {}
    }
    handleCopy()
  }

  const handleDownloadQr = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `${result?.name || 'app'}-qr-code.png`
    a.click()
  }

  if (!result) return null

  const tmpl = TEMPLATE_LABELS[result.templateType] || TEMPLATE_LABELS.service_booking

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span>✨</span>
            <span className="font-bold text-gray-900">VibeDeploy</span>
          </Link>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/dashboard">My Apps →</Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Celebration */}
        <div className="text-center mb-8" style={{ animation: 'slideUp 0.5s ease-out' }}>
          <div className="text-7xl mb-4" style={{ animation: 'bounceIn 0.6s ease-out' }}>🎉</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Your app is live!</h1>
          <p className="text-gray-500">
            <span className="font-semibold text-gray-700">{result.name}</span> is ready for customers right now.
          </p>
        </div>

        {/* Template badge */}
        <div className="flex justify-center mb-6">
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${tmpl.color}`}>
            {tmpl.label}
          </span>
        </div>

        {/* URL card — the hero of this page */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden mb-5" style={{ animation: 'slideUp 0.5s ease-out 0.15s both' }}>
          {/* Live indicator */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-2.5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white">Live and accessible to anyone with the link</span>
          </div>

          <div className="p-5">
            {/* URL display */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3.5 mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Your app URL</p>
                <p className="text-sm font-mono font-medium text-gray-900 truncate">
                  https://{result.url}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copy link"
              >
                {copied
                  ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                  : <Copy className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button size="lg" className="w-full font-semibold" asChild>
                <a href={`https://${result.url}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open App
                </a>
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                {copied
                  ? <><CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />Copied!</>
                  : <><Share2 className="mr-2 h-4 w-4" />Share Link</>
                }
              </Button>
            </div>

            {/* QR Code toggle */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
            >
              <QrCode className="h-4 w-4" />
              {showQr ? 'Hide QR Code' : 'Show QR Code for print & posters'}
            </button>

            {showQr && qrDataUrl && (
              <div className="mt-4 text-center" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="bg-white border border-gray-100 rounded-xl p-4 inline-block shadow-sm">
                  <img src={qrDataUrl} alt="QR Code" className="w-40 h-40" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Scan to open · Perfect for flyers & receipts</p>
                <button
                  onClick={handleDownloadQr}
                  className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium mx-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* What's next */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> What to do next
          </h3>
          <div className="space-y-3">
            {tmpl.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div style={{ animation: 'slideUp 0.5s ease-out 0.45s both' }}>
          <Button className="w-full" variant="ghost" size="lg" asChild>
            <Link href="/dashboard">
              Go to Dashboard — manage your apps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Want to build another? <Link href="/build" className="text-blue-600 font-medium hover:underline">Start a new app →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
