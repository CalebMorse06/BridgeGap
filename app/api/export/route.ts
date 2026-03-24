import { NextRequest, NextResponse } from 'next/server'
import { getApp } from '@/lib/store/apps'

/**
 * Returns the generated app HTML as a downloadable file.
 * GET /api/export?subdomain=bobsplumbing
 */
export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain')

  if (!subdomain) {
    return NextResponse.json({ error: 'Missing subdomain' }, { status: 400 })
  }

  const app = getApp(subdomain)

  if (!app) {
    return NextResponse.json({ error: 'App not found' }, { status: 404 })
  }

  // Return as downloadable HTML file
  const filename = `${subdomain}-app.html`
  return new NextResponse(app.html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
