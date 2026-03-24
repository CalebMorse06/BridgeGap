'use client'

import Link from 'next/link'
import { Plus, ExternalLink, BarChart2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

// Mock projects for demo
const MOCK_PROJECTS = [
  {
    id: '1',
    name: "Bob's Plumbing",
    templateType: 'service_booking',
    subdomain: 'bobsplumbing',
    deploymentUrl: 'bobsplumbing.vibedeploy.app',
    status: 'live',
    createdAt: '2026-03-20',
    stats: { views: 247, actions: 12 },
  },
  {
    id: '2',
    name: 'Taco Fiesta',
    templateType: 'restaurant_menu',
    subdomain: 'tacofiesta',
    deploymentUrl: 'tacofiesta.vibedeploy.app',
    status: 'live',
    createdAt: '2026-03-18',
    stats: { views: 891, actions: 0 },
  },
  {
    id: '3',
    name: 'Morning Flow Yoga Workshop',
    templateType: 'event_registration',
    subdomain: 'morningflowyoga',
    deploymentUrl: 'morningflowyoga.vibedeploy.app',
    status: 'live',
    createdAt: '2026-03-15',
    stats: { views: 312, actions: 38 },
  },
]

const TEMPLATE_LABELS: Record<string, { label: string; badge: string }> = {
  service_booking: { label: '🔧 Service Booking', badge: 'blue' },
  restaurant_menu: { label: '🍕 Restaurant Menu', badge: 'orange' },
  event_registration: { label: '🎉 Event Registration', badge: 'green' },
  waitlist: { label: '📋 Waitlist', badge: 'purple' },
}

const ACTION_LABELS: Record<string, string> = {
  service_booking: 'bookings',
  restaurant_menu: 'menu views',
  event_registration: 'registrations',
  waitlist: 'signups',
}

export default function DashboardPage() {
  const totalViews = MOCK_PROJECTS.reduce((sum, p) => sum + p.stats.views, 0)
  const totalActions = MOCK_PROJECTS.reduce((sum, p) => sum + p.stats.actions, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              VibeDeploy
            </Link>
          </div>
          <Button size="sm" asChild>
            <Link href="/build">
              <Plus className="mr-1.5 h-4 w-4" />
              Build New App
            </Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
          <p className="text-gray-500 mt-1 text-sm">{MOCK_PROJECTS.length} apps live and running</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Apps Live', value: MOCK_PROJECTS.length, icon: '🚀' },
            { label: 'Total Visitors', value: totalViews.toLocaleString(), icon: '👁️' },
            { label: 'Total Actions', value: totalActions.toLocaleString(), icon: '⚡' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_PROJECTS.map((project) => {
            const tmpl = TEMPLATE_LABELS[project.templateType]
            const actionLabel = ACTION_LABELS[project.templateType]
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{tmpl?.label}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Live</span>
                    </div>
                  </div>

                  {/* URL */}
                  <a
                    href={`https://${project.deploymentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-mono"
                  >
                    {project.deploymentUrl}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
                  <div className="bg-white px-5 py-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{project.stats.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">visitors</div>
                  </div>
                  <div className="bg-white px-5 py-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{project.stats.actions}</div>
                    <div className="text-xs text-gray-400">{actionLabel}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-3 flex items-center gap-2 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" asChild>
                    <a href={`https://${project.deploymentUrl}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3 w-3" />
                      View
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" asChild>
                    <Link href={`/dashboard/${project.id}`}>
                      <BarChart2 className="mr-1.5 h-3 w-3" />
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}

          {/* New app card */}
          <Link href="/build">
            <div className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 p-8 min-h-[200px] group">
              <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Build New App</div>
                <div className="text-xs text-gray-400 mt-0.5">Live in under 3 minutes</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
