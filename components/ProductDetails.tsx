'use client';

import { ArrowLeft } from 'lucide-react';
import { Product, TabType } from '@/types';

interface ProductDetailsProps {
  product: Product;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onGoBack: () => void;
  className?: string;
}

export function ProductDetails({
  product,
  activeTab,
  onTabChange,
  onGoBack,
  className = ""
}: ProductDetailsProps) {
  return (
    <div className={`app-container ${className}`}>
      <div className="product-details">
        <div className="product-details-header">
          <button onClick={onGoBack} className="back-button">
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1>{product.fullName}</h1>
          <p className="product-price">${product.price}</p>
        </div>

        <div className="product-tabs">
          <button 
            className={`tab ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => onTabChange('specs')}
          >
            Specifications
          </button>
          <button 
            className={`tab ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => onTabChange('features')}
          >
            Features
          </button>
          <button 
            className={`tab ${activeTab === 'pros-cons' ? 'active' : ''}`}
            onClick={() => onTabChange('pros-cons')}
          >
            Pros & Cons
          </button>
          <button 
            className={`tab ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => onTabChange('company')}
          >
            Company Info
          </button>
        </div>

        <div className="product-content">
          {activeTab === 'specs' && (
            <div className="specs-grid">
              <div className="spec-section">
                <h3>Display</h3>
                <div className="spec-item">
                  <span>Type:</span>
                  <span>{product.specifications.display.type}</span>
                </div>
                <div className="spec-item">
                  <span>Resolution:</span>
                  <span>{product.specifications.display.resolution}</span>
                </div>
                <div className="spec-item">
                  <span>Refresh Rate:</span>
                  <span>{product.specifications.display.refreshRate}</span>
                </div>
                <div className="spec-item">
                  <span>Brightness:</span>
                  <span>{product.specifications.display.brightness}</span>
                </div>
                <div className="spec-item">
                  <span>Field of View:</span>
                  <span>{product.specifications.display.fov}</span>
                </div>
                {product.specifications.display.colorAccuracy && (
                  <div className="spec-item">
                    <span>Color Accuracy:</span>
                    <span>{product.specifications.display.colorAccuracy}</span>
                  </div>
                )}
              </div>

              <div className="spec-section">
                <h3>Design</h3>
                <div className="spec-item">
                  <span>Weight:</span>
                  <span>{product.specifications.design.weight}</span>
                </div>
                <div className="spec-item">
                  <span>Material:</span>
                  <span>{product.specifications.design.material}</span>
                </div>
                <div className="spec-item">
                  <span>IPD Adjustment:</span>
                  <span>{product.specifications.design.ipdAdjustment}</span>
                </div>
                {product.specifications.design.dimming && (
                  <div className="spec-item">
                    <span>Dimming:</span>
                    <span>{product.specifications.design.dimming}</span>
                  </div>
                )}
              </div>

              <div className="spec-section">
                <h3>Audio</h3>
                <div className="spec-item">
                  <span>Speakers:</span>
                  <span>{product.specifications.audio.speakers}</span>
                </div>
                <div className="spec-item">
                  <span>Microphones:</span>
                  <span>{product.specifications.audio.microphones}</span>
                </div>
                {product.specifications.audio.soundLeakage && (
                  <div className="spec-item">
                    <span>Sound Leakage:</span>
                    <span>{product.specifications.audio.soundLeakage}</span>
                  </div>
                )}
              </div>

              <div className="spec-section">
                <h3>Connectivity</h3>
                <div className="spec-item">
                  <span>Connection:</span>
                  <span>{product.specifications.connectivity.connection}</span>
                </div>
                <div className="spec-item">
                  <span>Compatibility:</span>
                  <span>{product.specifications.connectivity.compatibility.join(', ')}</span>
                </div>
              </div>

              {product.specifications.features && (
                <div className="spec-section">
                  <h3>Features</h3>
                  {product.specifications.features.tracking && (
                    <div className="spec-item">
                      <span>Tracking:</span>
                      <span>{product.specifications.features.tracking}</span>
                    </div>
                  )}
                  {product.specifications.features.chip && (
                    <div className="spec-item">
                      <span>Chip:</span>
                      <span>{product.specifications.features.chip}</span>
                    </div>
                  )}
                  {product.specifications.features.latency && (
                    <div className="spec-item">
                      <span>Latency:</span>
                      <span>{product.specifications.features.latency}</span>
                    </div>
                  )}
                  {product.specifications.features.camera && (
                    <div className="spec-item">
                      <span>Camera:</span>
                      <span>{product.specifications.features.camera}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="features-list">
              <h3>Key Features</h3>
              <ul>
                {product.keyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <p className="product-description">{product.description}</p>
            </div>
          )}

          {activeTab === 'pros-cons' && (
            <div className="pros-cons">
              <div className="pros">
                <h3>Pros</h3>
                <ul>
                  {product.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="cons">
                <h3>Cons</h3>
                <ul>
                  {product.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="company-info">
              <h3>{product.brand}</h3>
              <div className="company-details">
                <div className="company-item">
                  <span>Founded:</span>
                  <span>{product.companyInfo.founded}</span>
                </div>
                <div className="company-item">
                  <span>Headquarters:</span>
                  <span>{product.companyInfo.headquarters}</span>
                </div>
                <div className="company-item">
                  <span>Employees:</span>
                  <span>{product.companyInfo.employees}</span>
                </div>
                <div className="company-item">
                  <span>Market Share:</span>
                  <span>{product.companyInfo.marketShare}</span>
                </div>
              </div>
              <p className="company-description">{product.companyInfo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}