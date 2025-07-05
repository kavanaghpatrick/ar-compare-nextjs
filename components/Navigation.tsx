'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, Menu, X, BarChart3, Grid, Settings } from 'lucide-react';
import arGlassesData from '@/data/products';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';

export function Navigation() {
  const { comparison } = useComparison();
  const pathname = usePathname();
  const guardedRouter = useNavigationGuard();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = Array.from(new Set(arGlassesData.map(product => product.category)));

  // Handle search with debouncing
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        guardedRouter.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm('');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target || typeof document === 'undefined') return;
      
      try {
        const target = event.target as HTMLElement;
        
        // Don't interfere with Next.js dev tools
        if (target.closest('[data-nextjs-dialog-overlay]') || 
            target.closest('[data-nextjs-error-overlay]') ||
            target.closest('[data-nextjs-inspector]') ||
            target.closest('#__next-dev-tools-indicator')) {
          return;
        }
        
        if (categoriesRef.current && !categoriesRef.current.contains(target)) {
          setShowCategories(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(target)) {
          setShowUserMenu(false);
        }
      } catch (error) {
        // Ignore DOM errors during cleanup
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      try {
        if (event.key === 'Escape') {
          setShowCategories(false);
          setShowUserMenu(false);
          setShowMobileMenu(false);
        }
      } catch (error) {
        // Ignore keyboard errors during cleanup
      }
    };

    // Add passive listeners for better performance
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleKeyDown, { passive: true });
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    try {
      setShowMobileMenu(false);
      setShowCategories(false);
      setShowUserMenu(false);
    } catch (error) {
      // Ignore state update errors during route changes
    }
  }, [pathname]);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link 
          href="/" 
          className="header-title"
        >
          AR Compare
        </Link>

        {/* Desktop Search */}
        <div className="header-search desktop-only" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AR glasses..."
                className="search-input"
                aria-label="Search products"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="search-clear"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav desktop-only" aria-label="Main navigation">
          <Link 
            href="/" 
            className={`nav-link ${
              pathname === '/' ? 'active' : ''
            }`}
          >
            <Grid size={16} />
            Products
          </Link>

          {/* Categories Dropdown */}
          <div className="nav-dropdown" ref={categoriesRef}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => setShowCategories(!showCategories)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowCategories(!showCategories);
                }
              }}
              aria-expanded={showCategories}
              aria-haspopup="true"
              aria-controls="categories-menu"
            >
              Categories
              <ChevronDown size={16} className={`dropdown-icon ${showCategories ? 'open' : ''}`} />
            </button>
            {showCategories && (
              <div id="categories-menu" className="nav-dropdown-menu" role="menu">
                <Link href="/" className="dropdown-item" role="menuitem">
                  All Products
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category}
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="dropdown-item"
                    role="menuitem"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/market-analysis" 
            className={`nav-link ${
              pathname === '/market-analysis' ? 'active' : ''
            }`}
          >
            Market Analysis
          </Link>
          
          <Link href="/brand" className="nav-link">Brands</Link>
          <Link href="/reviews" className="nav-link">Reviews</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Comparison Cart */}
          {comparison.items.length > 0 && (
            <Link 
              href="/compare"
              className="header-compare-btn"
              aria-label={`Compare ${comparison.items.length} products`}
            >
              <BarChart3 size={20} />
              <span className="compare-count">{comparison.items.length}</span>
              <span className="desktop-only">Compare</span>
            </Link>
          )}

          {/* User Menu */}
          <div className="header-user-menu" ref={userMenuRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
              aria-label="User settings"
            >
              <Settings size={20} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu" role="menu">
                <button className="dropdown-item">Dark Mode</button>
                <button className="dropdown-item">Preferences</button>
                <button className="dropdown-item">Help</button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle mobile-only"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          {/* Mobile Search */}
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search AR glasses..."
                  className="search-input"
                  aria-label="Search products"
                />
              </div>
            </form>
          </div>

          {/* Mobile Navigation */}
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link href="/" className={`mobile-nav-link ${
              pathname === '/' ? 'active' : ''
            }`}>
              <Grid size={20} />
              Products
            </Link>

            <div className="mobile-nav-section">
              <div className="mobile-nav-label">Categories</div>
              {categories.map(category => (
                <Link 
                  key={category}
                  href={`/?category=${encodeURIComponent(category)}`}
                  className="mobile-nav-sublink"
                >
                  {category}
                </Link>
              ))}
            </div>

            <Link 
              href="/market-analysis" 
              className={`mobile-nav-link ${
                pathname === '/market-analysis' ? 'active' : ''
              }`}
            >
              Market Analysis
            </Link>

            {comparison.items.length > 0 && (
              <Link 
                href="/compare"
                className="mobile-nav-link compare-link"
              >
                <BarChart3 size={20} />
                Compare ({comparison.items.length})
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}