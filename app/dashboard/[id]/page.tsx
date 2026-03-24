'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Copy, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock submissions for demo — in prod these come from Supabase
const MOCK_SUBMISSIONS: Record<string, { id: string; data: Record<string, string>; status: string; createdAt: string }[]> = {
  '1': [
    { id: 'a1', data: { name: 'John Hernandez', phone: '(512) 555-0187', service: 'Drain Cleaning', date: '2026-03-25', time: 'Morning (8–12)', notes: 'Main bathroom drain is slow' }, status: 'new', createdAt: '2026-03-24 09:14' },
    { id: 'a2', data: { name: 'Sarah Kim', phone: '(512) 555-0234', service: 'Pipe Repair', date: '2026-03-26', time: 'Afternoon (12–5)', notes: '' }, status: 'booked', createdAt: '2026-03-24 08:02' },
    { id: 'a3', data: { name: 'Marcus Lee', phone: '(512) 555-0399', service: 'Installation', date: '2026-03-27', time: 'Flexible', notes: 'New water heater install' }, status: 'new', createdAt: '2026-03-23 19:45' },
  ],
  '2': [],
  '3': [
    { id: 'b1', data: { name: 'Emma Wilson', email: 'emma@example.com', phone: '' }, status: 'new', createdAt: '2026-03-24 10:30' },
    { id: 'b2', data: { name: 'James Park', email: 'james@example.com', phone: '(913) 555-0122' }, status: 'new', createdAt: '2026-03-24 09:15' },
  ],
}

const MOCK_PROJECTS: Record<string, { name: string; templateType: string; deploymentUrl: string; status: string; createdAt: string; stats: { views: number; submissions: number } }> = {
  '1': { name: "Bob's Plumbing", templateType: 'service_booking', deploymentUrl: 'bobsplumbing.bridgegap.app', status: 'live', createdAt: '2026-03-20', stats: { views: 247, submissions: 12 } },
  '2': { name: 'Taco Fiesta', templateType: 'restaurant_menu', deploymentUrl: 'tacofiesta.bridgegap.app', status: 'live', createdAt: '2026-03-18', stats: { views: 891, submissions: 0 } },
  '3': { name: 'Morning Flow Yoga', templateType: 'event_registration', deploymentUrl: 'morningflowyoga.bridgegap.app', status: 'live', createdAt: '2026-03-15', stats: { views: 312, submissions: 38 } },
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  booked: 'bg-green-50 text-green-700 border-green-200',
  seen: 'bg-gray-50 text-gray-600 border-gray-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
}

const ACTION_LABEL: Record<string, string> = {
  service_booking: 'Booking Requests',
  restaurant_menu: 'Orders',
  event_registration: 'Registrations',
  waitlist: 'Signups',
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState(MOCK_PROJECTS[id] || null)
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS[id] || [])
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Button asChild><Link href="/dashboard">Back to Dashboard</Link></Button>
        </div>
      </div>
    )
  }

  const actionLabel = ACTION_LABEL[project.templateType] || 'Submissions'
  const newCount = submissions.filter(s => s.status === 'new').length

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${project.deploymentUrl}`)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleStatusChange = (subId: string, newStatus: string) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: newStatus } : s))
  }

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-gray-500">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900">{project.name}</span>
          </div>
          <Button size="sm" asChild>
            <a href={`https://${project.deploymentUrl}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View Live App
            </a>
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-sm text-gray-500 font-mono">{project.deploymentUrl}</code>
              <button onClick={handleCopyUrl} className="text-gray-400 hover:text-gray-600 transition-colors">
                {copiedUrl ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Visitors', value: project.stats.views.toLocaleString(), icon: '👁️', color: 'text-blue-600 bg-blue-50' },
            { label: actionLabel, value: project.stats.submissions.toLocaleString(), icon: '⚡', color: 'text-green-600 bg-green-50' },
            { label: 'Unread', value: newCount.toString(), icon: '🔔', color: newCount > 0 ? 'text-orange-600 bg-orange-50' : 'text-gray-500 bg-gray-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className={`text-lg mb-1 w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Submissions */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">{actionLabel}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{submissions.length} total · {newCount} new</p>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-4xl mb-4">📭</div>
              <p className="font-medium text-gray-700 mb-2">No {actionLabel.toLowerCase()} yet</p>
              <p className="text-sm text-gray-400 mb-6">Share your app link and they'll show up here in real time.</p>
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                {copiedUrl ? '✓ Copied!' : 'Copy App Link'}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <div key={sub.id} className={`px-6 py-4 transition-colors ${sub.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {sub.data.name || sub.data.email || 'Anonymous'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[sub.status]}`}>
                          {sub.status}
                        </span>
                        <span className="text-xs text-gray-400">{sub.createdAt}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
                        {Object.entries(sub.data)
                          .filter(([k, v]) => v && k !== 'notes')
                          .slice(0, 6)
                          .map(([k, v]) => (
                            <div key={k} className="text-xs">
                              <span className="text-gray-400 capitalize">{k}: </span>
                              <span className="text-gray-700 font-medium">{v}</span>
                            </div>
                          ))}
                      </div>
                      {sub.data.notes && (
                        <p className="text-xs text-gray-500 mt-1.5 italic">"{sub.data.notes}"</p>
                      )}
                    </div>
                    {project.templateType === 'service_booking' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleStatusChange(sub.id, 'booked')}
                          className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          ✓ Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(sub.id, 'declined')}
                          className="text-xs px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
