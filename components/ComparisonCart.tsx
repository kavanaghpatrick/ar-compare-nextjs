'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, X, BarChart3 } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import arGlassesData from '@/data/products';

export function ComparisonCart() {
  const { comparison, removeItem, clearComparison } = useComparison();
  const [showCart, setShowCart] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) return null;

  if (comparison.items.length === 0) return null;

  const selectedProductsData = comparison.items
    .map(item => arGlassesData.find(p => p.id === item.productId))
    .filter(product => product !== undefined);

  return (
    <div className="comparison-cart">
      <div className="cart-header">
        <div className="cart-title">
          <ShoppingCart className="cart-icon" />
          <span>Compare ({comparison.items.length}/6)</span>
        </div>
        <button 
          className="cart-toggle"
          onClick={() => setShowCart(!showCart)}
        >
          {showCart ? <Minus /> : <Plus />}
        </button>
      </div>
      
      {showCart && (
        <div className="cart-content">
          <div className="cart-products">
            {selectedProductsData.map(product => (
              <div key={product.id} className="cart-product">
                <div className="cart-product-info">
                  <span className="cart-product-name">{product.name}</span>
                  <span className="cart-product-price">${product.price}</span>
                </div>
                <button 
                  className="cart-remove"
                  onClick={() => removeItem(product.id)}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-actions">
            {comparison.items.length >= 2 && (
              <Link 
                href="/compare"
                className="cart-compare-btn"
              >
                <BarChart3 />
                Compare {comparison.items.length} Products
              </Link>
            )}
            <button 
              className="cart-clear-btn"
              onClick={clearComparison}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}