'use client';

import { useEffect } from 'react';

interface ServiceWorkerManagerProps {
  enabled?: boolean;
}

export function ServiceWorkerManager({ enabled = process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true' }: ServiceWorkerManagerProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const manageServiceWorker = async () => {
      if (!enabled) {
        // Unregister all service workers
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();

          for (const registration of registrations) {
            await registration.unregister();
          }

          // Clear all caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();

            for (const cacheName of cacheNames) {
              await caches.delete(cacheName);
            }
          }
        } catch {
          // Error disabling service workers - non-critical
        }
      } else {
        // Register service worker (only if enabled)
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });

          registration.addEventListener('updatefound', () => {
            // Service worker update found - handled automatically
          });
        } catch {
          // Service worker registration failed - non-critical
        }
      }
    };

    manageServiceWorker();
  }, [enabled]);

  return null;
}