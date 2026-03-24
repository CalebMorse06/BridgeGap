/**
 * In-memory app store for demo/hackathon mode.
 * In production, replace with Supabase or Redis.
 * Each deployed app is stored here keyed by subdomain.
 */

import { generateAppHTML } from '@/lib/templates/generate-app'

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

const GALLERY_APPS = [
  {
    subdomain: 'green-thumb-landscaping',
    name: 'Green Thumb Landscaping',
    templateType: 'service_booking',
    config: {
      businessName: 'Green Thumb Landscaping',
      services: 'Lawn care, Tree trimming, Irrigation systems',
      location: 'Denver CO',
      hours: 'Mon-Sat 7am-6pm',
      contactEmail: 'info@greenthumb.com',
      brandColor: '#059669',
    },
  },
  {
    subdomain: 'golden-dragon-kitchen',
    name: 'Golden Dragon Kitchen',
    templateType: 'restaurant_menu',
    config: {
      businessName: 'Golden Dragon Kitchen',
      cuisine: 'Chinese-American',
      menuItems: 'Kung Pao Chicken — Spicy wok-tossed — $14\nBeef Fried Rice — Classic takeout — $12\nPan-Fried Dumplings — Pork filling — $9\nSweet & Sour Pork — Crispy with house sauce — $13',
      addressAndHours: '123 Main St\nMon-Sun 11am-10pm',
      contactPhone: '(212) 555-0123',
      brandColor: '#ea580c',
    },
  },
  {
    subdomain: 'flow-yoga-austin',
    name: 'Flow Yoga Studio',
    templateType: 'event_registration',
    config: {
      eventName: 'Flow Yoga Studio Classes',
      organizerName: 'Flow Yoga Austin',
      eventDate: 'Ongoing — Mon/Wed/Fri',
      eventLocation: '512 Wellness Blvd, Austin TX',
      eventDescription: 'Vinyasa, Restorative Yoga, and Meditation classes for all levels',
      contactEmail: 'hello@flowyoga.com',
      brandColor: '#7c3aed',
    },
  },
  {
    subdomain: 'alex-chen-dev',
    name: 'Alex Chen — Full Stack Dev',
    templateType: 'portfolio',
    config: {
      yourName: 'Alex Chen',
      tagline: 'I build fast, beautiful web apps',
      skills: 'React, Node.js, TypeScript, AWS, PostgreSQL',
      location: 'San Francisco CA',
      contactEmail: 'alex@alexchen.dev',
      brandColor: '#4f46e5',
    },
  },
]

export function seedGalleryApps() {
  for (const app of GALLERY_APPS) {
    if (!store.has(app.subdomain)) {
      const html = generateAppHTML(
        app.templateType as Parameters<typeof generateAppHTML>[0],
        app.config,
      )
      saveApp(app.subdomain, {
        subdomain: app.subdomain,
        name: app.name,
        templateType: app.templateType,
        html,
      })
    }
  }
}

export const GALLERY_SUBDOMAINS = GALLERY_APPS.map(a => a.subdomain)
