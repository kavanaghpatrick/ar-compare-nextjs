// Service Worker for AR Compare - TEMPORARILY DISABLED
// This service worker is temporarily disabled for troubleshooting
console.log('[SW] Service worker is disabled for troubleshooting');

// Immediately unregister this service worker
self.addEventListener('install', () => {
  console.log('[SW] Skipping waiting and unregistering');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating and immediately unregistering');
  event.waitUntil(
    self.registration.unregister().then(() => {
      console.log('[SW] Service worker unregistered itself');
    })
  );
});

// Block all fetch events to prevent caching
self.addEventListener('fetch', (event) => {
  // Do nothing - let requests go through normally
  return;
});

// Original service worker code has been commented out and is available in git history
// To re-enable, restore the original service worker code and set NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true