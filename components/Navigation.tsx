'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, Menu, X, BarChart3, Grid, Settings } from 'lucide-react';
import arGlassesData from '@/data/products';

export function Navigation() {
  const { comparison } = useComparison();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = Array.from(new Set(arGlassesData.map(product => product.category)));

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Handle search dropdown if needed
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategories(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowCategories(false);
    setShowUserMenu(false);
  }, [pathname]);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="header-title">
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
        <nav className="nav desktop-only">
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
              aria-expanded={showCategories}
              aria-haspopup="true"
            >
              Categories
              <ChevronDown size={16} className={`dropdown-icon ${showCategories ? 'open' : ''}`} />
            </button>
            {showCategories && (
              <div className="nav-dropdown-menu">
                <Link href="/" className="dropdown-item">
                  All Products
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category}
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="dropdown-item"
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
          
          <a href="#brands" className="nav-link">Brands</a>
          <a href="#reviews" className="nav-link">Reviews</a>
          <a href="#news" className="nav-link">News</a>
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
              <div className="user-dropdown-menu">
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
          <nav className="mobile-nav">
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