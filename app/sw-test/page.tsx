'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerTestPage() {
  const [status, setStatus] = useState<string>('Loading...');
  const [registrations, setRegistrations] = useState<ServiceWorkerRegistration[]>([]);
  const [caches, setCaches] = useState<string[]>([]);

  useEffect(() => {
    const checkServiceWorker = async () => {
      if (!('serviceWorker' in navigator)) {
        setStatus('❌ Service Workers not supported');
        return;
      }

      try {
        // Check existing registrations
        const swRegistrations = await navigator.serviceWorker.getRegistrations();
        setRegistrations([...swRegistrations]);

        // Check caches
        if ('caches' in window) {
          const cacheNames = await window.caches.keys();
          setCaches(cacheNames);
        }

        if (swRegistrations.length === 0 && caches.length === 0) {
          setStatus('✅ Service Worker successfully disabled - no registrations or caches found');
        } else if (swRegistrations.length === 0) {
          setStatus('⚠️ No service workers registered, but caches still exist');
        } else {
          setStatus('❌ Service workers are still active');
        }
      } catch (error) {
        setStatus('❌ Error checking service worker status: ' + (error as Error).message);
      }
    };

    checkServiceWorker();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Service Worker Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Status:</h2>
        <p>{status}</p>
      </div>

      {registrations.length > 0 && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Active Service Workers ({registrations.length}):</h2>
          {registrations.map((reg, i) => (
            <div key={i} className="mb-2">
              <p><strong>Scope:</strong> {reg.scope}</p>
              <p><strong>State:</strong> {reg.active?.state || 'No active worker'}</p>
            </div>
          ))}
        </div>
      )}

      {caches.length > 0 && (
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Active Caches ({caches.length}):</h2>
          {caches.map((cacheName, i) => (
            <p key={i}>• {cacheName}</p>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>This page checks if service workers have been successfully disabled.</p>
        <p>If you see any active service workers or caches, visit <a href="/sw-manager" className="text-blue-600 underline">/sw-manager</a> to clear them.</p>
      </div>
    </div>
  );
}