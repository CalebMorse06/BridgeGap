import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get('name') || 'My App'
  const type = searchParams.get('type') || 'service_booking'

  const PILL_COLORS: Record<string, { bg: string; text: string }> = {
    service_booking: { bg: '#2563eb', text: '#fff' },
    restaurant_menu: { bg: '#ea580c', text: '#fff' },
    event_registration: { bg: '#059669', text: '#fff' },
    waitlist: { bg: '#7c3aed', text: '#fff' },
    portfolio: { bg: '#4f46e5', text: '#fff' },
    donation: { bg: '#dc2626', text: '#fff' },
  }

  const TYPE_LABELS: Record<string, string> = {
    service_booking: 'Service Booking',
    restaurant_menu: 'Restaurant Menu',
    event_registration: 'Event Registration',
    waitlist: 'Waitlist',
    portfolio: 'Portfolio',
    donation: 'Donation Page',
  }

  const pill = PILL_COLORS[type] || PILL_COLORS.service_booking
  const label = TYPE_LABELS[type] || 'Web App'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        }}
      >
        {/* Top left: BridgeGap branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>✨</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>BridgeGap</span>
        </div>

        {/* Center: App name + pill badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <h1
            style={{
              fontSize: name.length > 30 ? '42px' : '56px',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            {name}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: pill.bg,
              color: pill.text,
              padding: '10px 24px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            {label}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px', color: '#94a3b8' }}>
            bridgegap.app — From idea to live app in 60 seconds
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
