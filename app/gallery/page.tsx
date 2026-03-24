'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryApp {
  subdomain: string
  name: string
  templateType: string
}

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  service_booking: { label: '🔧 Service Booking', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  restaurant_menu: { label: '🍕 Restaurant Menu', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  event_registration: { label: '🎉 Events', color: 'bg-green-50 text-green-700 border-green-200' },
  waitlist: { label: '📋 Waitlist', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  portfolio: { label: '🎨 Portfolio', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  donation: { label: '❤️ Donation', color: 'bg-red-50 text-red-700 border-red-200' },
}

export default function GalleryPage() {
  const [apps, setApps] = useState<GalleryApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setApps(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="text-lg font-black text-gray-900">BridgeGap</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button size="sm" asChild>
                <Link href="/build">
                  Start Building <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="py-16 px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          <span
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Built with BridgeGap
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Real apps. Real businesses. Zero code.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3 animate-bounce">✨</div>
            <p className="text-sm text-gray-500">Loading gallery...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {apps.map(app => {
              const badge = TYPE_BADGES[app.templateType] || TYPE_BADGES.service_booking
              return (
                <div
                  key={app.subdomain}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Mini browser mockup */}
                  <div className="bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2 px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate">
                        {app.subdomain}.bridgegap.app
                      </div>
                    </div>
                    {/* iframe preview */}
                    <div style={{ height: '300px', overflow: 'hidden', pointerEvents: 'none' }}>
                      <iframe
                        src={`/api/preview/${app.subdomain}`}
                        title={app.name}
                        className="w-full h-full border-0"
                        style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                      />
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{app.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <Link
                        href={`/build?template=${app.templateType}`}
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Build Similar <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/preview/${app.subdomain}`}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        View app →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
