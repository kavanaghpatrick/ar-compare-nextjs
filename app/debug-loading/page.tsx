'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    // Check if window is available
    addLog('Window available: ' + (typeof window !== 'undefined'));
    
    // Check if document is ready
    addLog('Document readyState: ' + document.readyState);
    
    // Listen for errors
    const errorHandler = (event: ErrorEvent) => {
      const errorMsg = `Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
      addLog(errorMsg);
      setError(errorMsg);
    };
    
    window.addEventListener('error', errorHandler);
    
    // Check for unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
      addLog(errorMsg);
      setError(errorMsg);
    };
    
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    // Check localStorage access
    try {
      localStorage.getItem('test');
      addLog('localStorage access: OK');
    } catch (e) {
      addLog('localStorage access: FAILED - ' + (e as Error).message);
    }
    
    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        addLog(`Service Workers registered: ${registrations.length}`);
        registrations.forEach((reg, i) => {
          addLog(`SW ${i}: ${reg.scope} - ${reg.active?.state || 'no active worker'}`);
        });
      });
    }
    
    // Check React hydration
    addLog('React hydration check started');
    
    // Monitor DOM changes
    const observer = new MutationObserver((mutations) => {
      addLog(`DOM mutations detected: ${mutations.length} changes`);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Loading Page</h1>
      <div>
        <h2>Status</h2>
        <p>Page loaded successfully if you can see this.</p>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error detected:</strong> {error}
          </div>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Logs</h2>
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          maxHeight: '400px', 
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}