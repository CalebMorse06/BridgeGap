const CACHE = 'vibedeploy-v1'
const OFFLINE_URL = '/'

// Cache key assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/build', '/dashboard', '/demo'])
    ).then(() => self.skipWaiting())
  )
})

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Network first, fall back to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('/api/')) return // never cache API

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(event.request, clone))
        return res
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_URL)))
  )
})
