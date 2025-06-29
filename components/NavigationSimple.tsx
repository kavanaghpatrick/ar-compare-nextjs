'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationSimple() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/market-analysis', label: 'Market Analysis' },
    { href: '/brand', label: 'Brands' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/news', label: 'News' },
    { href: '/compare', label: 'Compare' },
  ];

  return (
    <nav style={{
      background: 'rgba(0,0,0,0.5)',
      padding: '1rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ fontWeight: 'bold', marginRight: '2rem' }}>
        AR Compare
      </div>
      
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            padding: '0.5rem 1rem',
            background: pathname === link.href ? 'rgba(255,255,255,0.2)' : 'transparent',
            borderRadius: '4px',
            color: '#fff',
            textDecoration: 'none',
            // NO TRANSITIONS!
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}