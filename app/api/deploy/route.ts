import { NextRequest, NextResponse } from 'next/server'
import { saveApp } from '@/lib/store/apps'

interface DeployFile {
  file: string
  data: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { subdomain, files, name, templateType } = await req.json()
    const token = process.env.VERCEL_API_TOKEN

    // Find the main HTML file
    const indexFile = (files as DeployFile[]).find(f => f.file === 'index.html')
    const html = indexFile?.data || ''

    // Always save to in-memory store for instant preview (works without Vercel)
    saveApp(subdomain, { subdomain, name: name || subdomain, templateType: templateType || '', html })

    // If no Vercel token — serve from our own API
    if (!token) {
      const previewUrl = `${APP_URL}/api/preview/${subdomain}`
      await new Promise(r => setTimeout(r, 1800)) // simulate deploy time
      return NextResponse.json({
        url: previewUrl.replace(/^https?:\/\//, ''),
        deploymentId: `local_${Date.now()}`,
        status: 'ready',
        mode: 'preview',
      })
    }

    // Real Vercel deployment
    const projectName = `vd-${subdomain}-${Date.now()}`.slice(0, 52)

    const payload = {
      name: projectName,
      files: (files as DeployFile[]).map(f => ({
        file: f.file,
        data: Buffer.from(f.data).toString('base64'),
        encoding: 'base64',
      })),
      projectSettings: { framework: null },
      target: 'production',
    }

    const res = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(process.env.VERCEL_TEAM_ID ? { 'x-vercel-team-id': process.env.VERCEL_TEAM_ID } : {}),
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Vercel deployment failed')

    const deploymentId = data.id
    let deploymentUrl = data.url || `${projectName}.vercel.app`

    // Poll for ready
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000))
      const statusRes = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(process.env.VERCEL_TEAM_ID ? { 'x-vercel-team-id': process.env.VERCEL_TEAM_ID } : {}),
        },
      })
      const statusData = await statusRes.json()
      if (statusData.readyState === 'READY') { deploymentUrl = statusData.url || deploymentUrl; break }
      if (statusData.readyState === 'ERROR') throw new Error('Deployment error')
    }

    return NextResponse.json({ url: deploymentUrl, deploymentId, status: 'ready', mode: 'vercel' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Deployment failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
