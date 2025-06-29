'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Plus, Minus, X, BarChart3, Maximize2, Eye } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import arGlassesData from '@/data/products';
import { Product } from '@/types';

interface ComparisonCartProps {
  onQuickView?: (product: Product) => void;
  isMinimized?: boolean;
  position?: 'fixed' | 'sticky';
}

function ComparisonCart({ 
  onQuickView, 
  isMinimized = false, 
  position = 'fixed' 
}: ComparisonCartProps = {}) {
  const { comparison, removeItem, clearComparison } = useComparison();
  const [showCart, setShowCart] = useState(!isMinimized);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Auto-minimize on product detail pages for better UX
  useEffect(() => {
    if (pathname.startsWith('/products/')) {
      setShowCart(false);
    }
  }, [pathname]);
  
  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCart) {
        setShowCart(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCart]);

  // Don't render anything until client-side hydration is complete
  if (!isClient) return null;

  const isOnComparePage = pathname === '/compare';
  
  // Don't show cart on compare page to avoid redundancy
  if (isOnComparePage) return null;

  if (comparison.items.length === 0) return null;

  const selectedProductsData = comparison.items
    .map(item => arGlassesData.find(p => p.id === item.productId))
    .filter(product => product !== undefined);

  return (
    <div 
      className={`comparison-cart ${position} ${isMobile ? 'mobile' : 'desktop'} ${
        isDragging ? 'dragging' : ''
      }`}
      role="complementary"
      aria-label="Product comparison cart"
    >
      <div className="cart-header">
        <div className="cart-title">
          <ShoppingCart className="cart-icon" aria-hidden="true" />
          <span>Compare ({comparison.items.length}/6)</span>
          {comparison.items.length >= 6 && (
            <span className="cart-limit-warning" aria-label="Maximum items reached">
              Max
            </span>
          )}
        </div>
        <div className="cart-controls">
          {!isMobile && comparison.items.length > 0 && (
            <Link
              href="/compare"
              className="cart-quick-compare"
              aria-label="Go to full comparison view"
            >
              <Maximize2 size={16} />
            </Link>
          )}
          <button 
            className="cart-toggle"
            onClick={() => setShowCart(!showCart)}
            aria-expanded={showCart}
            aria-label={showCart ? 'Minimize comparison cart' : 'Expand comparison cart'}
          >
            {showCart ? <Minus /> : <Plus />}
          </button>
        </div>
      </div>
      
      {showCart && (
        <div 
          className="cart-content"
          role="region"
          aria-label="Comparison cart contents"
        >
          <div className="cart-products">
            {selectedProductsData.length === 0 ? (
              <div className="cart-empty">
                <p>No products added for comparison yet.</p>
                <p className="cart-empty-hint">Click "Compare" on any product to get started!</p>
              </div>
            ) : (
              selectedProductsData.map(product => (
                <div key={product.id} className="cart-product">
                  <div className="cart-product-image">
                    <img 
                      src={product.image} 
                      alt={product.fullName}
                      className="cart-product-thumb"
                    />
                  </div>
                  <div className="cart-product-info">
                    <Link 
                      href={`/products/${product.id}`}
                      className="cart-product-name"
                      title={product.fullName}
                    >
                      {product.name || product.fullName}
                    </Link>
                    <div className="cart-product-details">
                      <span className="cart-product-price">${product.price}</span>
                      <span className="cart-product-category">{product.category}</span>
                    </div>
                  </div>
                  <div className="cart-product-actions">
                    {onQuickView && (
                      <button 
                        className="cart-quick-view"
                        onClick={() => onQuickView(product)}
                        aria-label={`Quick view ${product.fullName}`}
                        title="Quick view"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    <button 
                      className="cart-remove"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.fullName} from comparison`}
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {selectedProductsData.length > 0 && (
            <div className="cart-actions">
              {comparison.items.length >= 2 ? (
                <Link 
                  href="/compare"
                  className="cart-compare-btn primary"
                  aria-label={`Compare ${comparison.items.length} selected products`}
                >
                  <BarChart3 size={16} />
                  Compare {comparison.items.length} Products
                </Link>
              ) : (
                <div className="cart-compare-hint">
                  Add {2 - comparison.items.length} more product{2 - comparison.items.length !== 1 ? 's' : ''} to compare
                </div>
              )}
              
              <button 
                className="cart-clear-btn secondary"
                onClick={clearComparison}
                aria-label="Clear all products from comparison"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced hook for cart state management
export function useComparisonCartState() {
  const { comparison } = useComparison();
  const pathname = usePathname();
  
  const isCartVisible = comparison.items.length > 0 && pathname !== '/compare';
  const canCompare = comparison.items.length >= 2;
  const isAtLimit = comparison.items.length >= 6;
  
  return {
    isCartVisible,
    canCompare,
    isAtLimit,
    itemCount: comparison.items.length,
    maxItems: 6
  };
}
export default ComparisonCart;
export { ComparisonCart };
