'use client';

import { 
  Grid3X3, 
  BarChart3, 
  X, 
  Check, 
  Minus, 
  ArrowLeft 
} from 'lucide-react';
import { Product, ComparisonViewType, SortOption, SortOrder } from '@/types';
import { SortControls } from './SortControls';

interface ComparisonTableProps {
  products: Product[];
  comparisonView: ComparisonViewType;
  sortBy: SortOption;
  sortOrder: SortOrder;
  onViewChange: (view: ComparisonViewType) => void;
  onSortByChange: (sortBy: SortOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onRemoveProduct: (productId: string) => void;
  onGoBack: () => void;
  className?: string;
}

export function ComparisonTable({
  products,
  comparisonView,
  sortBy,
  sortOrder,
  onViewChange,
  onSortByChange,
  onSortOrderChange,
  onRemoveProduct,
  onGoBack,
  className = ""
}: ComparisonTableProps) {
  // Sort products based on current sort criteria
  const sortedProducts = [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'brand':
        aValue = a.brand;
        bValue = b.brand;
        break;
      case 'fov':
        aValue = parseInt(a.specifications.display.fov) || 0;
        bValue = parseInt(b.specifications.display.fov) || 0;
        break;
      case 'weight':
        aValue = parseInt(a.specifications.design.weight) || 0;
        bValue = parseInt(b.specifications.design.weight) || 0;
        break;
      default:
        aValue = a.price;
        bValue = b.price;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className={`app-container ${className}`}>
      <header className="header">
        <div className="header-container">
          <div className="header-title">AR Compare - Comparison</div>
          <nav className="nav">
            <button onClick={onGoBack} className="btn btn-outline">
              <ArrowLeft size={16} />
              Back to Products
            </button>
          </nav>
        </div>
      </header>

      <main className="comparison-main">
        <div className="comparison-container">
          {/* Comparison Header */}
          <div className="comparison-header">
            <div className="comparison-title-section">
              <h1 className="comparison-title">
                <BarChart3 size={32} />
                Compare AR Glasses
              </h1>
              <p className="comparison-subtitle">
                Comparing {products.length} AR glasses side-by-side
              </p>
            </div>

            {/* Controls */}
            <div className="comparison-controls">
              <div className="view-toggle">
                <button
                  onClick={() => onViewChange('grid')}
                  className={`view-btn ${comparisonView === 'grid' ? 'active' : ''}`}
                >
                  <Grid3X3 size={16} />
                  Grid View
                </button>
                <button
                  onClick={() => onViewChange('table')}
                  className={`view-btn ${comparisonView === 'table' ? 'active' : ''}`}
                >
                  <BarChart3 size={16} />
                  Table View
                </button>
              </div>

              <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={onSortByChange}
                onSortOrderChange={onSortOrderChange}
              />
            </div>
          </div>

          {/* Grid View */}
          {comparisonView === 'grid' && (
            <div className="comparison-grid">
              {sortedProducts.map((product) => (
                <div key={product.id} className="comparison-card">
                  <div className="comparison-card-header">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="remove-btn"
                    >
                      <X size={16} />
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
                          <Check size={16} />
                          Pros
                        </h4>
                        <ul className="pros-list">
                          {product.pros.slice(0, 3).map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="cons-section">
                        <h4 className="cons-title">
                          <Minus size={16} />
                          Cons
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
          {comparisonView === 'table' && (
            <div className="comparison-table-container">
              <div className="comparison-table-scroll">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="spec-header">Specification</th>
                      {sortedProducts.map(product => (
                        <th key={product.id} className="product-header">
                          <div className="product-header-content">
                            <button
                              onClick={() => onRemoveProduct(product.id)}
                              className="remove-btn-small"
                            >
                              <X size={14} />
                            </button>
                            <div className="product-info">
                              <div className="product-name">{product.fullName}</div>
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
                      {sortedProducts.map(product => (
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
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="category-badge">{product.category}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Display Type</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Resolution</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.resolution}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Field of View</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="highlight-value">{product.specifications.display.fov}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Brightness</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.brightness}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Refresh Rate</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.display.refreshRate}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Weight</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          <span className="highlight-value">{product.specifications.design.weight}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Material</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.design.material}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Audio</td>
                      {sortedProducts.map(product => (
                        <td key={product.id} className="spec-value-cell">
                          {product.specifications.audio.speakers}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="spec-name">Connection</td>
                      {sortedProducts.map(product => (
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