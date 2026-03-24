'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            BridgeGap
          </Link>
          <Button size="sm" asChild>
            <Link href="/build">
              <Plus className="mr-1.5 h-4 w-4" />
              New Website
            </Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Websites</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage and monitor your sites.</p>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
            <Plus className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No websites yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs text-center">
            Your first website will appear here after you build it. It only takes a few minutes.
          </p>
          <Button asChild>
            <Link href="/build">
              <Plus className="mr-1.5 h-4 w-4" />
              Build your first website
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
