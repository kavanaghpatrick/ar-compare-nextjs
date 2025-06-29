'use client';

import Link from 'next/link';

export default function DebugNavPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>🔍 Navigation Debug Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Direct Links Test</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link href="/market-analysis" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              🔗 Market Analysis (Next.js Link)
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a href="/market-analysis" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              🔗 Market Analysis (Regular Link)
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link href="/compare" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              🔗 Compare Page (Next.js Link)
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link href="/products/xreal-one-pro" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              🔗 Product Page (Next.js Link)
            </Link>
          </li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Manual URL Test</h2>
        <p>Try typing these URLs directly in the address bar:</p>
        <ul>
          <li><code>http://localhost:3000/market-analysis</code></li>
          <li><code>http://localhost:3000/compare</code></li>
          <li><code>http://localhost:3000/products/xreal-one-pro</code></li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>JavaScript Navigation Test</h2>
        <button 
          onClick={() => window.location.href = '/market-analysis'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Go to Market Analysis (window.location)
        </button>
        
        <button 
          onClick={() => {
            // Test if router is available
            if (typeof window !== 'undefined') {
              console.log('Current location:', window.location.href);
              console.log('Trying to navigate to market-analysis...');
              window.location.href = '/market-analysis';
            }
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Debug Navigation
        </button>
      </div>
      
      <div>
        <h2>Back to Home</h2>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}