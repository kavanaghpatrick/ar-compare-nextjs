'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import { ComparisonCart } from '@/components/ComparisonCart';
import arGlassesData from '@/data/products';
import { Product } from '@/types';

export default function ComparePage() {
  const { comparison, removeItem, clearComparison } = useComparison();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get the actual product objects for comparison
  const comparisonProducts = useMemo(() => {
    return comparison.items
      .map(item => arGlassesData.find(product => product.id === item.productId))
      .filter((product): product is Product => product !== undefined)
      .sort((a, b) => {
        const aItem = comparison.items.find(item => item.productId === a.id);
        const bItem = comparison.items.find(item => item.productId === b.id);
        return (aItem?.position || 0) - (bItem?.position || 0);
      });
  }, [comparison.items]);

  if (comparison.items.length === 0) {
    return (
      <div className="app-container">
        <ComparisonCart />
        <header className="header">
          <div className="header-container">
            <div className="header-title">AR Compare</div>
            <nav className="nav">
              <Link href="/" className="btn btn-outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="comparison-main">
          <div className="comparison-container">
            <div className="text-center py-12">
              <div className="text-white/40 text-4xl mb-4">📊</div>
              <h1 className="text-2xl font-bold text-white mb-2">No products to compare</h1>
              <p className="text-white/80 mb-6">
                Add some products to your comparison to see them side by side.
              </p>
              <Link
                href="/"
                className="btn btn-primary"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="app-container">
      <ComparisonCart />
      <header className="header">
        <div className="header-container">
          <div className="header-title">AR Compare - Comparison</div>
          <nav className="nav">
            <Link href="/" className="btn btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </nav>
        </div>
      </header>

      <main className="comparison-main">
        <div className="comparison-container">
          {/* Comparison Header */}
          <div className="comparison-header">
            <div className="comparison-title-section">
              <h1 className="comparison-title">
                📊 Compare AR Glasses
              </h1>
              <p className="comparison-subtitle">
                Comparing {comparisonProducts.length} AR glasses side-by-side
              </p>
            </div>

            {/* Controls */}
            <div className="comparison-controls">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('table')}
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                >
                  📊 Table View
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                >
                  🗂 Card View
                </button>
              </div>

              <button
                onClick={clearComparison}
                className="btn btn-outline"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'cards' && (
            <div className="comparison-grid">
              {comparisonProducts.map((product) => (
                <div key={product.id} className="comparison-card">
                  <div className="comparison-card-header">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="remove-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="product-category-badge">{product.category}</div>
                  </div>

                  <div className="comparison-card-content">
                    <h3 className="comparison-product-title">{product.fullName}</h3>
                    <div className="comparison-price">${product.price}</div>
                    
                    <div className="comparison-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-value">{product.rating}</span>
                    </div>

                    {/* Key Specs Grid */}
                    <div className="comparison-specs">
                      <div className="spec-group">
                        <h4>Display</h4>
                        <div className="spec-row">
                          <span className="spec-label">Type:</span>
                          <span className="spec-value">{product.specifications.display.type}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Resolution:</span>
                          <span className="spec-value">{product.specifications.display.resolution}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">FOV:</span>
                          <span className="spec-value">{product.specifications.display.fov}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Brightness:</span>
                          <span className="spec-value">{product.specifications.display.brightness}</span>
                        </div>
                      </div>

                      <div className="spec-group">
                        <h4>Design</h4>
                        <div className="spec-row">
                          <span className="spec-label">Weight:</span>
                          <span className="spec-value">{product.specifications.design.weight}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Material:</span>
                          <span className="spec-value">{product.specifications.design.material}</span>
                        </div>
                      </div>

                      <div className="spec-group">
                        <h4>Audio</h4>
                        <div className="spec-row">
                          <span className="spec-label">Speakers:</span>
                          <span className="spec-value">{product.specifications.audio.speakers}</span>
                        </div>
                      </div>

                      <div className="spec-group">
                        <h4>Connectivity</h4>
                        <div className="spec-row">
                          <span className="spec-label">Connection:</span>
                          <span className="spec-value">{product.specifications.connectivity.connection}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="comparison-pros-cons">
                      <div className="pros-section">
                        <h4 className="pros-title">
                          ✓ Pros
                        </h4>
                        <ul className="pros-list">
                          {product.pros.slice(0, 3).map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="cons-section">
                        <h4 className="cons-title">
                          ✗ Cons
                        </h4>
                        <ul className="cons-list">
                          {product.cons.slice(0, 3).map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="comparison-table-container">
              <div className="comparison-table-scroll">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="spec-header">Specification</th>
                      {comparisonProducts.map(product => (
                        <th key={product.id} className="product-header">
                          <div className="product-header-content">
                            <button
                              onClick={() => removeItem(product.id)}
                              className="remove-btn-small"
                            >
                              <X size={14} />
                            </button>
                            <div className="product-info">
                              <div className="product-name">{product.name}</div>
                              <div className="product-price">${product.price}</div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="spec-name">Rating</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <div className="rating-cell">
                            <span className="rating-number">{product.rating}</span>
                            <div className="stars-small">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`star-small ${i < Math.floor(product.rating) ? 'filled' : 'empty'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Category</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="category-badge">{product.category}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Display Type</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Resolution</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.resolution}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Field of View</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="highlight-value">{product.specifications.display.fov}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Brightness</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.brightness}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Refresh Rate</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.refreshRate}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Weight</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="highlight-value">{product.specifications.design.weight}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Material</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.design.material}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Audio</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.audio.speakers}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Connection</td>
                      {comparisonProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.connectivity.connection}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}