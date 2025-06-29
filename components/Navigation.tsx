'use client';

import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { comparison } = useComparison();
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-title">
          AR Compare
        </Link>
        
        <nav className="nav">
          <Link 
            href="/" 
            className={`text-white/80 hover:text-white transition-colors ${
              pathname === '/' ? 'text-white' : ''
            }`}
          >
            Products
          </Link>
          <Link 
            href="/market-analysis" 
            className={`text-white/80 hover:text-white transition-colors ${
              pathname === '/market-analysis' ? 'text-white' : ''
            }`}
          >
            Market Analysis
          </Link>
          <a href="#brands" className="text-white/80 hover:text-white transition-colors">Brands</a>
          <a href="#reviews" className="text-white/80 hover:text-white transition-colors">Reviews</a>
          <a href="#news" className="text-white/80 hover:text-white transition-colors">News</a>
          
          {comparison.items.length > 0 && (
            <Link 
              href="/compare"
              className="btn btn-outline"
            >
              Compare ({comparison.items.length})
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}