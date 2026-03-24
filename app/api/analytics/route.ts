import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ ok: true })

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createAdminClient } = await import('@/lib/supabase/client')
      const admin = createAdminClient()
      await admin.rpc('increment_stat', { project_id: projectId, stat_key: 'views' })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
