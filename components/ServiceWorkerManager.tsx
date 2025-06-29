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
          console.log(`[SW Manager] Found ${registrations.length} service workers`);
          
          for (const registration of registrations) {
            const success = await registration.unregister();
            console.log(`[SW Manager] Unregistered SW at ${registration.scope}: ${success}`);
          }

          // Clear all caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log(`[SW Manager] Found ${cacheNames.length} caches`);
            
            for (const cacheName of cacheNames) {
              await caches.delete(cacheName);
              console.log(`[SW Manager] Deleted cache: ${cacheName}`);
            }
          }
          
          console.log('[SW Manager] Service workers disabled and caches cleared');
        } catch (error) {
          console.error('[SW Manager] Error disabling service workers:', error);
        }
      } else {
        // Register service worker (only if enabled)
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          console.log('[SW Manager] Service worker registered:', registration);
          
          registration.addEventListener('updatefound', () => {
            console.log('[SW Manager] Service worker update found');
          });
        } catch (error) {
          console.error('[SW Manager] Service worker registration failed:', error);
        }
      }
    };

    manageServiceWorker();
  }, [enabled]);

  return null;
}