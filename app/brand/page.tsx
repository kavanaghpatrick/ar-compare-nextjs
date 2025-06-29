'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import arGlassesData from '@/data/products';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';


export default function BrandsPage() {
  const brands = useMemo(() => {
    try {
      const brandData = arGlassesData.reduce((acc, product) => {
        if (!acc[product.brand]) {
          acc[product.brand] = {
            name: product.brand,
            products: [],
            totalProducts: 0,
            priceRange: { min: Infinity, max: 0 },
            avgRating: 0
          };
        }
        
        acc[product.brand].products.push(product);
        acc[product.brand].totalProducts++;
        acc[product.brand].priceRange.min = Math.min(acc[product.brand].priceRange.min, product.price);
        acc[product.brand].priceRange.max = Math.max(acc[product.brand].priceRange.max, product.price);
        
        return acc;
      }, {} as Record<string, any>);

      // Calculate average ratings
      Object.values(brandData).forEach((brand: any) => {
        const totalRating = brand.products.reduce((sum: number, product: any) => sum + product.rating, 0);
        brand.avgRating = (totalRating / brand.products.length).toFixed(1);
      });

      return Object.values(brandData).sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error processing brand data:', error);
      return [];
    }
  }, []);

  if (!brands || brands.length === 0) {
    return (
      <div className="app-container">
        <NavigationSimple />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Loading Brands...</h1>
            <p className="text-white/80">Please wait while we load the brand information.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  try {

    return (
    <div className="app-container">
      <NavigationSimple />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">AR Glasses Brands</h1>
          <p className="text-xl text-white/80 mb-6">
            Explore all AR glasses manufacturers and discover their product lineups
          </p>
        </div>

        <div className="products-grid">
          {brands.map((brand: any, index: number) => (
            <Link 
              key={`brand-${brand.name}-${index}`}
              href={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="product-card brand-card"
            >
              <div className="brand-header">
                <h2 className="product-title">{brand.name}</h2>
                <div className="brand-stats">
                  <span className="stat-item">
                    {brand.totalProducts} product{brand.totalProducts !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="brand-info">
                <div className="price-range">
                  <span className="label">Price Range:</span>
                  <span className="value">
                    ${brand.priceRange.min} - ${brand.priceRange.max}
                  </span>
                </div>
                
                <div className="avg-rating">
                  <span className="label">Avg Rating:</span>
                  <div className="rating">
                    <span className="rating-text">{brand.avgRating}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={`${brand.name}-star-${i}`} 
                          className={`star ${i < Math.floor(Number(brand.avgRating)) ? 'star-filled' : 'star-empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="brand-products">
                <h3 className="products-label">Products:</h3>
                <ul className="product-list">
                  {brand.products.slice(0, 3).map((product: any, productIndex: number) => (
                    <li key={`${brand.name}-product-${product.id}-${productIndex}`} className="product-item">
                      {product.name} <span className="product-price">${product.price}</span>
                    </li>
                  ))}
                  {brand.products.length > 3 && (
                    <li key={`${brand.name}-more-items`} className="product-item more">
                      +{brand.products.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>

              <div className="brand-cta">
                <span className="cta-text">View All Products →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="btn btn-outline"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
      <Footer />
    </div>
    );
  } catch (error) {
    console.error('Error rendering BrandsPage:', error);
    return (
      <div className="app-container">
        <NavigationSimple />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Brands</h1>
            <p className="text-white/80 mb-6">There was an error loading the brands page.</p>
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}