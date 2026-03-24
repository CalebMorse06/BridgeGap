'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const subdomain = params.subdomain as string

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content')
  const [fields, setFields] = useState({
    businessName: '',
    headline: '',
    subheadline: '',
    ctaText: 'Book Now',
    hours: '',
    location: '',
    contactEmail: '',
    brandColor: '#2563eb',
  })

  // Load saved config from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem('vibedeploy_config')
    if (raw) {
      const config = JSON.parse(raw)
      setFields(f => ({
        ...f,
        businessName: config.answers?.businessName || '',
        hours: config.answers?.hours || '',
        location: config.answers?.location || '',
        contactEmail: config.answers?.contactEmail || '',
        brandColor: config.answers?.brandColor || '#2563eb',
      }))
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // In production: re-generate and re-deploy with updated fields
    // For demo: simulate save
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const setField = useCallback((key: string, value: string) => {
    setFields(f => ({ ...f, [key]: value }))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-gray-500">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900">Edit App</span>
            <code className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-md">{subdomain}</code>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/preview/${subdomain}`} target="_blank">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />Saving...</>
              ) : saved ? (
                <><span className="text-emerald-200">✓</span> Saved!</>
              ) : (
                <><Save className="h-3.5 w-3.5 mr-1.5" />Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: editor */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {(['content', 'design', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                    activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'content' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <div>
                  <Label>Business Name</Label>
                  <Input value={fields.businessName} onChange={e => setField('businessName', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Hero Headline</Label>
                  <Input value={fields.headline} onChange={e => setField('headline', e.target.value)} placeholder="Professional service you can count on" className="mt-1.5" />
                  <p className="text-xs text-gray-400 mt-1">The main text at the top of your app</p>
                </div>
                <div>
                  <Label>Subheadline</Label>
                  <Input value={fields.subheadline} onChange={e => setField('subheadline', e.target.value)} placeholder="Book online in seconds — no phone calls needed" className="mt-1.5" />
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input value={fields.ctaText} onChange={e => setField('ctaText', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Hours</Label>
                  <Input value={fields.hours} onChange={e => setField('hours', e.target.value)} placeholder="Mon–Fri 8am–5pm" className="mt-1.5" />
                </div>
                <div>
                  <Label>Location / Service Area</Label>
                  <Input value={fields.location} onChange={e => setField('location', e.target.value)} placeholder="Austin, TX" className="mt-1.5" />
                </div>
                <div>
                  <Label>Notification Email</Label>
                  <Input type="email" value={fields.contactEmail} onChange={e => setField('contactEmail', e.target.value)} placeholder="you@example.com" className="mt-1.5" />
                  <p className="text-xs text-gray-400 mt-1">Where we send booking notifications</p>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="mb-6">
                  <Label className="mb-3 block">Brand Color</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {BRAND_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setField('brandColor', c.value)}
                        className={`h-12 rounded-xl border-2 transition-all hover:scale-105 flex items-center justify-center`}
                        style={{
                          background: c.value,
                          borderColor: fields.brandColor === c.value ? '#111827' : 'transparent',
                        }}
                        title={c.name}
                      >
                        {fields.brandColor === c.value && (
                          <span className="text-white font-bold text-lg">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Label>Custom color</Label>
                    <input
                      type="color"
                      value={fields.brandColor}
                      onChange={e => setField('brandColor', e.target.value)}
                      className="h-9 w-16 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <code className="text-sm text-gray-500 font-mono">{fields.brandColor}</code>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Download App</p>
                    <p className="text-xs text-gray-400 mt-0.5">Get the HTML file to host anywhere</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/api/export?subdomain=${subdomain}`} download>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download HTML
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-900">App URL</p>
                    <p className="text-xs text-gray-400 mt-0.5">Your app is live at this address</p>
                  </div>
                  <code className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded-lg">{subdomain}.bridgegap.app</code>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm text-red-600">Delete App</p>
                    <p className="text-xs text-gray-400 mt-0.5">Permanently remove this app</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: mini preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Live Preview</p>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-gray-400 font-mono ml-2 truncate">{subdomain}.bridgegap.app</span>
                </div>
                <iframe
                  src={`/api/preview/${subdomain}`}
                  className="w-full border-0"
                  style={{ height: '500px' }}
                  sandbox="allow-scripts"
                  title="Preview"
                />
              </div>
              <Button className="w-full mt-4" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? '✓ Changes Saved' : 'Save & Republish'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
