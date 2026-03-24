import { NextRequest, NextResponse } from 'next/server'

// Mock projects for demo — replace with Supabase in production
const MOCK_PROJECTS = [
  {
    id: '1',
    name: "Bob's Plumbing",
    templateType: 'service_booking',
    subdomain: 'bobsplumbing',
    deploymentUrl: 'bobsplumbing.vibedeploy.app',
    status: 'live',
    createdAt: '2026-03-20',
    stats: { views: 247, actions: 12 },
  },
  {
    id: '2',
    name: 'Taco Fiesta',
    templateType: 'restaurant_menu',
    subdomain: 'tacofiesta',
    deploymentUrl: 'tacofiesta.vibedeploy.app',
    status: 'live',
    createdAt: '2026-03-18',
    stats: { views: 891, actions: 0 },
  },
]

export async function GET() {
  return NextResponse.json({ projects: MOCK_PROJECTS })
}

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, unknown> = await req.json()
    const project = {
      id: Date.now().toString(),
      ...body,
      status: 'live',
      createdAt: new Date().toISOString(),
      stats: { views: 0, actions: 0 },
    }
    return NextResponse.json({ project })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
