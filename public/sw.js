// Service Worker for AR Compare - Performance Optimization
const CACHE_NAME = 'ar-compare-v1';
const STATIC_CACHE_NAME = 'ar-compare-static-v1';
const DYNAMIC_CACHE_NAME = 'ar-compare-dynamic-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add other static assets as needed
];

// Product images and API responses will be cached dynamically
const CACHEABLE_PATHS = [
  '/api/products',
  '/api/market',
  '/products/',
  '/compare',
  '/market-analysis'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('SW: Install event');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activate event');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy for different types of requests
  if (isStaticAsset(url.pathname)) {
    // Cache first for static assets
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(url.pathname)) {
    // Stale while revalidate for API requests
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  } else if (isCacheablePage(url.pathname)) {
    // Network first for pages (for fresh content)
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (isProductImage(url.pathname)) {
    // Cache first for product images
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('/static/') || 
         pathname.includes('/_next/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.woff');
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/');
}

function isCacheablePage(pathname) {
  return CACHEABLE_PATHS.some(path => pathname.startsWith(path));
}

function isProductImage(pathname) {
  return pathname.includes('/api/placeholder/') ||
         pathname.includes('/images/') ||
         (pathname.includes('product') && (pathname.endsWith('.jpg') || pathname.endsWith('.png') || pathname.endsWith('.webp')));
}

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache first failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('SW: Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Content unavailable', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Fetch fresh response in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.error('SW: Stale while revalidate fetch failed:', error);
  });

  // Return cached response immediately if available, otherwise wait for network
  if (cachedResponse) {
    fetchPromise; // Don't await - let it run in background
    return cachedResponse;
  } else {
    return fetchPromise;
  }
}

// Background sync for failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implement background sync logic here
      console.log('SW: Background sync triggered')
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: 'ar-compare-notification',
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/icon-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icon-dismiss.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});