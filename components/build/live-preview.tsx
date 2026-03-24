'use client'

import { useMemo } from 'react'
import { generateAppHTML, type TemplateType } from '@/lib/templates/generate-app'

interface LivePreviewProps {
  templateType: TemplateType | null
  answers: Record<string, string>
  className?: string
}

export function LivePreview({ templateType, answers, className = '' }: LivePreviewProps) {
  const html = useMemo(() => {
    if (!templateType) return null
    try {
      return generateAppHTML(templateType, answers)
    } catch {
      return null
    }
  }, [templateType, answers])

  if (!templateType) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 ${className}`}>
        <div className="text-center px-8">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="font-semibold text-gray-700 mb-2">Your app preview will appear here</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Start chatting and watch your app come to life in real time
          </p>
        </div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 ${className}`}>
        <div className="text-center">
          <div className="animate-spin text-3xl mb-3">⚙️</div>
          <p className="text-sm text-gray-500">Building preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white ${className}`}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 font-mono border border-gray-200 text-center truncate">
            {answers.businessName || answers.eventName || answers.waitlistFor
              ? `${(answers.businessName || answers.eventName || answers.waitlistFor || '').toLowerCase().replace(/[^a-z0-9]/g, '')}.vibedeploy.app`
              : 'yourapp.vibedeploy.app'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-green-600">Live</span>
        </div>
      </div>

      {/* iframe preview */}
      <iframe
        srcDoc={html}
        className="w-full border-0"
        style={{ height: 'calc(100% - 40px)', minHeight: '400px' }}
        sandbox="allow-scripts"
        title="App Preview"
      />
    </div>
  )
}
