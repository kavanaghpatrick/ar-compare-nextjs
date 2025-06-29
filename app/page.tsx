'use client';

import { useState, useMemo, useEffect } from 'react';
// import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { ComparisonCart } from '@/components/ComparisonCart';
// import { StructuredData } from '@/components/StructuredData';
import arGlassesData from '@/data/products';

export default function Home() {
  const { addItem, removeItem, isInComparison } = useComparison();
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = arGlassesData;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.fullName.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.keyFeatures.some(feature => feature.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [searchTerm]);

  const handleToggleComparison = (productId: string) => {
    if (isInComparison(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="app-container">
        <section className="hero">
          <div className="hero-container">
            <h1 className="hero-title">The Ultimate AR & AI Glasses Comparison</h1>
            <p className="hero-subtitle">Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ComparisonCart />
      {/* <StructuredData products={filteredProducts} page="home" /> */}
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">The Ultimate AR & AI Glasses Comparison</h1>
          <p className="hero-subtitle">
            Compare specs, features, and prices of the latest AR glasses from top manufacturers. Make informed decisions with our comprehensive database.
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary">Start Comparing</button>
            <button className="btn btn-outline">View All Products</button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-number">8+</div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat">
              <div className="stat-number">15+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat">
              <div className="stat-number">Daily</div>
              <div className="stat-label">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-container">
          <div className="search-container">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search AR glasses..."
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="section-title">{filteredProducts.length} Products Found</h2>
            <p className="text-white/60 mb-4">
              Enhanced with comprehensive Amazon research, customer reviews, and market analysis
            </p>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCompare={handleToggleComparison}
                isInComparison={isInComparison(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}