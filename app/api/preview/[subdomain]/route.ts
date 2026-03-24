import { NextRequest, NextResponse } from 'next/server'
import { getApp } from '@/lib/store/apps'

/**
 * Serves a generated app's HTML at /api/preview/[subdomain]
 * This lets judges visit a live URL without needing a Vercel token.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const { subdomain } = await params
  const app = getApp(subdomain)

  if (!app) {
    return new NextResponse(
      `<!DOCTYPE html>
<html><head><title>Not Found</title>
<style>body{font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f9fafb;margin:0}
.box{text-align:center;max-width:400px;padding:40px 20px}
h1{font-size:24px;font-weight:800;color:#111827;margin-bottom:8px}
p{color:#6b7280;margin-bottom:24px}
a{background:#2563eb;color:#fff;padding:12px 28px;border-radius:10px;font-weight:600;text-decoration:none}
</style></head>
<body><div class="box">
<div style="font-size:48px;margin-bottom:16px">🔍</div>
<h1>App not found</h1>
<p>This app doesn't exist yet, or it was built in a different session. Build your own at BridgeGap.</p>
<a href="/">Build My App →</a>
</div></body></html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(app.html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  })
}
