import { NextResponse } from 'next/server'
import { seedGalleryApps, listApps, GALLERY_SUBDOMAINS } from '@/lib/store/apps'

export async function GET() {
  seedGalleryApps()
  const all = listApps()
  const gallery = all.filter(a => GALLERY_SUBDOMAINS.includes(a.subdomain))
  return NextResponse.json(gallery)
}
