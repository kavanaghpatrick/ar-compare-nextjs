'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    console.log('Debug page mounted');
    console.log('Window location:', window.location);
    console.log('Document ready state:', document.readyState);
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Page</h1>
      <p>If you see this, the basic app is working.</p>
      <p>Check the browser console for errors.</p>
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
}