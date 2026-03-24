import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VibeDeploy — Turn Your Idea Into a Live App',
  description: 'Describe what you need. AI builds it, deploys it, and makes it live — in minutes. No coding required.',
  openGraph: {
    title: 'VibeDeploy',
    description: 'From idea to live app in minutes. No coding required.',
    url: 'https://vibedeploy.app',
    siteName: 'VibeDeploy',
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
      <body className="antialiased">{children}</body>
    </html>
  )
}
