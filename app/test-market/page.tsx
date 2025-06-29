'use client';

import Link from 'next/link';

export default function TestMarketPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>🧪 Market Analysis Test Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Navigation Test</h2>
        <p>This page is specifically to test navigation to market analysis.</p>
        
        <div style={{ margin: '20px 0' }}>
          <h3>Method 1: Next.js Link</h3>
          <Link 
            href="/market-analysis"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px'
            }}
          >
            Go to Market Analysis
          </Link>
        </div>
        
        <div style={{ margin: '20px 0' }}>
          <h3>Method 2: Regular Link (Forces Page Reload)</h3>
          <a 
            href="/market-analysis"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '5px'
            }}
          >
            Go to Market Analysis (Reload)
          </a>
        </div>
        
        <div style={{ margin: '20px 0' }}>
          <h3>Method 3: JavaScript Navigation</h3>
          <button 
            onClick={() => {
              console.log('Attempting navigation...');
              window.location.href = '/market-analysis';
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Go to Market Analysis (JS)
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Quick Tests:</h3>
        <ul>
          <li>✅ Can you see this page? (Server rendering works)</li>
          <li>❓ Do the buttons have hover effects? (CSS working)</li>
          <li>❓ Do console logs appear when clicking JS button? (JS working)</li>
          <li>❓ Does any navigation method work?</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
        <a href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          ← Back to Home (Regular Link)
        </a>
        <span style={{ margin: '0 1rem' }}>|</span>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          ← Back to Home (Next.js Link)
        </Link>
      </div>
    </div>
  );
}