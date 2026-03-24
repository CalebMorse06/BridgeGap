'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">😕</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We hit an unexpected error. This is usually temporary — try again and it should work.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
      </div>
    </div>
  )
}
