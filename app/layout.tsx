import type { Metadata } from 'next'
import './globals.css'

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'BridgeGap — Turn Your Idea Into a Live App',
  description: 'Describe what you need. AI builds it, deploys it, and makes it live — in minutes. No coding required.',
  openGraph: {
    title: 'BridgeGap',
    description: 'From idea to live app in minutes. No coding required.',
    url: 'https://bridgegap.app',
    siteName: 'BridgeGap',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BridgeGap" />
      </head>
      <body className="antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </body>
    </html>
  )
}
