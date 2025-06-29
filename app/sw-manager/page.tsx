'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function ServiceWorkerManagerPage() {
  const [status, setStatus] = useState<'loading' | 'idle' | 'processing'>('loading');
  const [registrations, setRegistrations] = useState<ServiceWorkerRegistration[]>([]);
  const [caches, setCaches] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadServiceWorkers = async () => {
    if (!('serviceWorker' in navigator)) {
      setMessage({ type: 'error', text: 'Service workers are not supported in this browser' });
      setStatus('idle');
      return;
    }

    try {
      const swRegistrations = await navigator.serviceWorker.getRegistrations();
      setRegistrations([...swRegistrations]);

      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        setCaches(cacheNames);
      }

      setStatus('idle');
    } catch (error) {
      console.error('Failed to load service workers:', error);
      setMessage({ type: 'error', text: 'Failed to load service worker information' });
      setStatus('idle');
    }
  };

  useEffect(() => {
    loadServiceWorkers();
  }, []);

  const unregisterAll = async () => {
    setStatus('processing');
    setMessage(null);

    try {
      // Unregister all service workers
      for (const registration of registrations) {
        await registration.unregister();
      }

      // Clear all caches
      for (const cacheName of caches) {
        await window.caches.delete(cacheName);
      }

      setMessage({ type: 'success', text: 'All service workers and caches have been cleared successfully!' });
      
      // Reload the data
      await loadServiceWorkers();
    } catch (error) {
      console.error('Failed to unregister service workers:', error);
      setMessage({ type: 'error', text: 'Failed to unregister some service workers' });
      setStatus('idle');
    }
  };

  const clearSpecificCache = async (cacheName: string) => {
    try {
      await window.caches.delete(cacheName);
      setMessage({ type: 'success', text: `Cache "${cacheName}" has been deleted` });
      await loadServiceWorkers();
    } catch (error) {
      console.error('Failed to delete cache:', error);
      setMessage({ type: 'error', text: `Failed to delete cache "${cacheName}"` });
    }
  };

  const unregisterSpecific = async (registration: ServiceWorkerRegistration) => {
    try {
      await registration.unregister();
      setMessage({ type: 'success', text: `Service worker at ${registration.scope} has been unregistered` });
      await loadServiceWorkers();
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
      setMessage({ type: 'error', text: 'Failed to unregister service worker' });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Service Worker Manager
            <Button
              variant="outline"
              size="icon"
              onClick={loadServiceWorkers}
              disabled={status === 'processing'}
            >
              <RefreshCw className={`h-4 w-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          <CardDescription>
            Manage service workers and caches for troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {message.type === 'error' && <XCircle className="h-4 w-4" />}
              {message.type === 'info' && <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{message.type === 'success' ? 'Success' : message.type === 'error' ? 'Error' : 'Info'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Service Workers ({registrations.length})</h3>
            {registrations.length === 0 ? (
              <p className="text-muted-foreground">No service workers are currently registered.</p>
            ) : (
              <div className="space-y-2">
                {registrations.map((registration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">{registration.scope}</p>
                      <p className="text-xs text-muted-foreground">
                        State: {registration.active?.state || 'No active worker'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unregisterSpecific(registration)}
                      disabled={status === 'processing'}
                    >
                      Unregister
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Caches ({caches.length})</h3>
            {caches.length === 0 ? (
              <p className="text-muted-foreground">No caches are currently stored.</p>
            ) : (
              <div className="space-y-2">
                {caches.map((cacheName, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <p className="font-mono text-sm">{cacheName}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => clearSpecificCache(cacheName)}
                      disabled={status === 'processing'}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={unregisterAll}
              disabled={status === 'processing' || (registrations.length === 0 && caches.length === 0)}
              className="w-full"
            >
              {status === 'processing' ? 'Processing...' : 'Clear All Service Workers & Caches'}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              After clearing service workers and caches, you may need to refresh the page or close and reopen your browser tab for changes to take full effect.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}