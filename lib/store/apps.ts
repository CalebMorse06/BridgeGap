/**
 * In-memory app store for demo/hackathon mode.
 * In production, replace with Supabase or Redis.
 * Each deployed app is stored here keyed by subdomain.
 */

interface StoredApp {
  subdomain: string
  name: string
  templateType: string
  html: string
  createdAt: number
}

// Module-level store (persists across requests in same process)
const store = new Map<string, StoredApp>()

export function saveApp(subdomain: string, app: Omit<StoredApp, 'createdAt'>) {
  store.set(subdomain, { ...app, createdAt: Date.now() })
}

export function getApp(subdomain: string): StoredApp | undefined {
  return store.get(subdomain)
}

export function listApps(): StoredApp[] {
  return Array.from(store.values()).sort((a, b) => b.createdAt - a.createdAt)
}

export function deleteApp(subdomain: string) {
  store.delete(subdomain)
}
