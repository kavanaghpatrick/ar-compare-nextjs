'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestNavigation() {
  const [clickCount, setClickCount] = useState(0);
  const [navCount, setNavCount] = useState(0);
  const router = useRouter();

  const handleButtonClick = () => {
    console.log('Button clicked at:', new Date().toISOString());
    setClickCount(prev => prev + 1);
  };

  const handleRouterNav = () => {
    console.log('Router navigation at:', new Date().toISOString());
    setNavCount(prev => prev + 1);
    router.push('/');
  };

  return (
    <div style={{ padding: '50px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Navigation Test Page</h1>
      <p>Testing different navigation methods to isolate the double-click issue</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
        {/* Test 1: Plain button */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 1: Plain Button</h2>
          <button 
            onClick={handleButtonClick}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Click Me ({clickCount})
          </button>
        </div>

        {/* Test 2: Next.js Link */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 2: Next.js Link</h2>
          <Link 
            href="/"
            style={{ padding: '10px 20px', background: '#333', color: '#fff', textDecoration: 'none', display: 'inline-block' }}
          >
            Go to Home (Link)
          </Link>
        </div>

        {/* Test 3: Router.push */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 3: Router.push</h2>
          <button 
            onClick={handleRouterNav}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Go to Home (Router) ({navCount})
          </button>
        </div>

        {/* Test 4: Link with NO styles */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 4: Unstyled Link</h2>
          <Link href="/market-analysis">
            Market Analysis (No Styles)
          </Link>
        </div>

        {/* Test 5: Link with transitions */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 5: Link with Transitions</h2>
          <Link 
            href="/blog"
            style={{ 
              padding: '10px 20px', 
              background: '#333', 
              color: '#fff', 
              textDecoration: 'none', 
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
          >
            Blog (With Transition)
          </Link>
        </div>

        {/* Test 6: Multiple quick links */}
        <div style={{ border: '1px solid #fff', padding: '20px' }}>
          <h2>Test 6: Multiple Links</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/" style={{ padding: '5px 10px', background: '#222', color: '#fff' }}>Home</Link>
            <Link href="/brand" style={{ padding: '5px 10px', background: '#222', color: '#fff' }}>Brand</Link>
            <Link href="/reviews" style={{ padding: '5px 10px', background: '#222', color: '#fff' }}>Reviews</Link>
            <Link href="/blog" style={{ padding: '5px 10px', background: '#222', color: '#fff' }}>Blog</Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#111' }}>
        <h3>Console Output</h3>
        <p>Open browser console to see click timestamps</p>
      </div>
    </div>
  );
}