import { NextRequest, NextResponse } from 'next/server'

interface DeployFile {
  file: string
  data: string
}

export async function POST(req: NextRequest) {
  try {
    const { subdomain, files } = await req.json()
    const token = process.env.VERCEL_API_TOKEN

    if (!token) {
      // Fallback for demo without token — simulate deployment
      await new Promise((r) => setTimeout(r, 2000))
      return NextResponse.json({
        url: `${subdomain}.vibedeploy.app`,
        deploymentId: `demo_${Date.now()}`,
        status: 'ready',
      })
    }

    const projectName = `vibedeploy-${subdomain}-${Date.now()}`.substring(0, 52)

    const payload = {
      name: projectName,
      files: files.map((f: DeployFile) => ({
        file: f.file,
        data: Buffer.from(f.data).toString('base64'),
        encoding: 'base64',
      })),
      projectSettings: {
        framework: null,
      },
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

    if (!res.ok) {
      console.error('Vercel error:', data)
      throw new Error(data.error?.message || 'Deployment failed')
    }

    // Poll for ready state
    const deploymentId = data.id
    let deploymentUrl = data.url || `${projectName}.vercel.app`

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const statusRes = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(process.env.VERCEL_TEAM_ID ? { 'x-vercel-team-id': process.env.VERCEL_TEAM_ID } : {}),
        },
      })
      const statusData = await statusRes.json()
      if (statusData.readyState === 'READY') {
        deploymentUrl = statusData.url || deploymentUrl
        break
      }
      if (statusData.readyState === 'ERROR') {
        throw new Error('Deployment encountered an error')
      }
    }

    return NextResponse.json({
      url: deploymentUrl,
      deploymentId,
      status: 'ready',
    })
  } catch (error) {
    console.error('Deploy error:', error)
    const message = error instanceof Error ? error.message : 'Deployment failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
