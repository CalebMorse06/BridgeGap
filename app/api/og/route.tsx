import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get('name') || 'My App'
  const type = searchParams.get('type') || 'service_booking'

  const COLORS: Record<string, { bg: string; accent: string }> = {
    service_booking: { bg: '#eff6ff', accent: '#2563eb' },
    restaurant_menu: { bg: '#fff7ed', accent: '#ea580c' },
    event_registration: { bg: '#ecfdf5', accent: '#059669' },
    waitlist: { bg: '#f5f3ff', accent: '#7c3aed' },
    portfolio: { bg: '#eef2ff', accent: '#4f46e5' },
    donation: { bg: '#fef2f2', accent: '#dc2626' },
  }

  const ICONS: Record<string, string> = {
    service_booking: '🔧',
    restaurant_menu: '🍕',
    event_registration: '🎉',
    waitlist: '📋',
    portfolio: '🎨',
    donation: '❤️',
  }

  const colors = COLORS[type] || COLORS.service_booking
  const icon = ICONS[type] || '✨'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.bg,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '48px' }}>✨</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>VibeDeploy</span>
        </div>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>{icon}</div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#111827',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.1,
          }}
        >
          {name}
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#6b7280',
            marginTop: '12px',
          }}
        >
          Built in 60 seconds · No coding required
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px',
            background: colors.accent,
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          Visit App →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
