'use client';

import { NavigationSimple } from '@/components/NavigationSimple';
import Link from 'next/link';

export default function CompareTestPage() {
  return (
    <div className="app-container">
      <NavigationSimple />
      
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Compare Page Test</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
          This is a simple test page to check if navigation works.
        </p>
        <Link 
          href="/" 
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Back to Home
        </Link>
      </main>
    </div>
  );
}