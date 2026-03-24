import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client (anon key)
export const supabase = createClient(url, anon)

// Server-side admin client (service role)
export function createAdminClient() {
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type SubmissionRow = {
  id: string
  project_id: string
  data: Record<string, string>
  created_at: string
  status: 'new' | 'seen' | 'booked' | 'declined'
}

export type ProjectRow = {
  id: string
  name: string
  template_type: string
  subdomain: string
  deployment_url: string
  status: 'live' | 'draft' | 'error'
  config: Record<string, unknown>
  notification_email: string | null
  created_at: string
  stats: { views: number; submissions: number }
}
