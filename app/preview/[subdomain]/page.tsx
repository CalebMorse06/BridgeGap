import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'App Preview — VibeDeploy',
}

export default function PreviewPage({ params }: { params: { subdomain: string } }) {
  const previewUrl = `/api/preview/${params.subdomain}`

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-600 border border-gray-200 flex items-center gap-2">
            <span className="text-green-500">🔒</span>
            <span className="truncate">vibedeploy.app/preview/{params.subdomain}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-600">Live</span>
          </div>
          <Link
            href="/build"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Build Yours →
          </Link>
        </div>
      </div>

      {/* App iframe */}
      <div className="flex-1 relative">
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="Your App"
          sandbox="allow-scripts allow-forms allow-same-origin"
        />
      </div>
    </div>
  )
}
