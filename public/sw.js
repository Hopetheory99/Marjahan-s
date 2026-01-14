// Service Worker for Marjahan's Jewelry PWA
const CACHE_NAME = 'marjahans-jewelry-v1.0.0';
const STATIC_CACHE = 'marjahans-static-v1.0.0';
const DYNAMIC_CACHE = 'marjahans-dynamic-v1.0.0';
const API_CACHE = 'marjahans-api-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/user/profile',
  '/api/cart',
  '/api/wishlist',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== 'GET') return;

  // API requests - Network first with cache fallback
  if (
    url.pathname.startsWith('/api/') ||
    API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))
  ) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Static assets - Cache first
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)
  ) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Images - Cache first with network fallback
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Default - Network first with cache fallback
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests (Network first)
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('API Network failed, trying cache:', error);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API calls
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline. Please check your internet connection.',
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

// Handle static assets (Cache first)
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Static asset fetch failed:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Handle images (Cache first with network update)
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const cache = caches.open(DYNAMIC_CACHE);
          cache.then((cache) => cache.put(request, networkResponse));
        }
      })
      .catch(() => {
        // Silently fail background updates
      });

    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder for failed images
    return new Response('', { status: 404 });
  }
}

// Handle default requests (Network first)
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful HTML pages
      if (request.headers.get('accept')?.includes('text/html')) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
  }

  // Try cache fallback
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }

  return new Response('Offline - Please check your internet connection', { status: 503 });
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');

  const options = {
    body: event.data ? event.data.text() : 'New updates available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Marjahan's Jewelry", options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Background sync implementation
async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync');

  try {
    // Sync pending orders, wishlist changes, etc.
    const pendingRequests = await getPendingRequests();

    for (const request of pendingRequests) {
      try {
        await fetch(request);
        await removePendingRequest(request);
      } catch (error) {
        console.log('Background sync failed for request:', request.url);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Helper functions for pending requests (would be implemented with IndexedDB)
async function getPendingRequests() {
  // This would retrieve pending requests from IndexedDB
  return [];
}

async function removePendingRequest(request) {
  // This would remove completed requests from IndexedDB
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  console.log('Service Worker: Periodic content sync');

  try {
    // Update product catalog, user preferences, etc.
    const cache = await caches.open(API_CACHE);

    // Refresh important API data
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response);
        }
      } catch (error) {
        console.log('Content sync failed for:', endpoint);
      }
    }
  } catch (error) {
    console.log('Content sync failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
