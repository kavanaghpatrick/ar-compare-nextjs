'use client';

import { useEffect, useState } from 'react';

export default function TestMinimalPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    console.log('[TestMinimal] Component mounted');
    setMounted(true);
  }, []);
  
  console.log('[TestMinimal] Rendering, mounted:', mounted);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Minimal Page</h1>
      <p>This is a minimal test page</p>
      <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
      <p>If you can see this, basic rendering works!</p>
    </div>
  );
}