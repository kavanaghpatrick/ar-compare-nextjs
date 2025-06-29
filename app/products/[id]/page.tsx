'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import arGlassesData from '@/data/products';
import { Product, TabType } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem, removeItem, isInComparison } = useComparison();
  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = arGlassesData.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="product-details">
        <div className="product-details-header">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-white/20 rounded w-3/4 mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="product-details-header">
          <Link href="/" className="back-button">
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <div className="text-center py-12">
            <div className="text-white/40 text-4xl mb-4">🤔</div>
            <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
            <p className="text-white/80 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/"
              className="btn btn-primary"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // const handleToggleComparison = () => {
  //   if (isInComparison(product.id)) {
  //     removeItem(product.id);
  //   } else {
  //     addItem(product.id);
  //   }
  // };

  // const renderStars = (rating: number) => {
  //   return Array.from({ length: 5 }, (_, index) => (
  //     <Star
  //       key={index}
  //       className={`w-5 h-5 ${
  //         index < Math.floor(rating)
  //           ? 'text-yellow-400 fill-current'
  //           : 'text-gray-300'
  //       }`}
  //     />
  //   ));
  // };

  return (
    <div className="app-container">
      <div className="product-details">
      <div className="product-details-header">
        <Link href="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Products
        </Link>
        <h1>{product.name}</h1>
        <p className="product-price">${product.price}</p>
      </div>

      <div className="product-tabs">
        <button 
          className={`tab ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Specifications
        </button>
        <button 
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button 
          className={`tab ${activeTab === 'pros-cons' ? 'active' : ''}`}
          onClick={() => setActiveTab('pros-cons')}
        >
          Pros & Cons
        </button>
        <button 
          className={`tab ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
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