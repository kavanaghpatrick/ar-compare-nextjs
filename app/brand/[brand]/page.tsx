import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import arGlassesData from '@/data/products';
import { PageLayout } from '@/components/PageLayout';

interface BrandPageProps {
  params: Promise<{
    brand: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const brandName = brand
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${brandName} AR Glasses - All Models & Reviews | AR Compare`,
    description: `Explore all ${brandName} AR glasses and smart glasses. Compare specs, prices, and features of ${brandName}'s augmented reality devices. Find the perfect ${brandName} AR glasses for your needs.`,
    keywords: `${brandName} AR glasses, ${brandName} smart glasses, ${brandName} augmented reality, ${brandName} reviews, AR compare`,
    openGraph: {
      title: `${brandName} AR Glasses - All Models | AR Compare`,
      description: `Discover and compare all ${brandName} AR glasses with detailed specifications and reviews.`,
      type: 'website',
      url: `/brand/${brand}`,
    },
    alternates: {
      canonical: `/brand/${brand}`,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  
  // Convert URL slug back to brand name (e.g., "brilliant-labs" -> "Brilliant Labs")
  const brandName = brand
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Find all products for this brand
  const brandProducts = arGlassesData.filter(
    product => product.brand.toLowerCase() === brandName.toLowerCase()
  );
  
  if (brandProducts.length === 0) {
    notFound();
  }
  
  // Get brand statistics
  const priceRange = {
    min: Math.min(...brandProducts.map(p => p.price)),
    max: Math.max(...brandProducts.map(p => p.price)),
  };
  
  const avgRating = brandProducts.reduce((sum, p) => sum + p.rating, 0) / brandProducts.length;
  const categories = [...new Set(brandProducts.map(p => p.category))];
  
  // Get company info from the first product
  const companyInfo = brandProducts[0]?.companyInfo;
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="mb-8">
          <nav className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Brand</span>
            <span className="mx-2">/</span>
            <span className="text-white">{brandName}</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {brandName} AR Glasses
          </h1>
          
          <p className="text-white/80 text-lg mb-6">
            Explore all AR glasses and smart glasses from {brandName}. 
            Compare models, specifications, and find the perfect device for your needs.
          </p>
          
          {/* Brand Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-white/60 text-sm mb-1">Models</div>
              <div className="text-2xl font-bold text-white">{brandProducts.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-white/60 text-sm mb-1">Price Range</div>
              <div className="text-2xl font-bold text-white">
                ${priceRange.min} - ${priceRange.max}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-white/60 text-sm mb-1">Avg Rating</div>
              <div className="text-2xl font-bold text-white">
                {avgRating.toFixed(1)} / 5.0
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-white/60 text-sm mb-1">Categories</div>
              <div className="text-2xl font-bold text-white">{categories.length}</div>
            </div>
          </div>
          
          {/* Company Info */}
          {companyInfo && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">About {brandName}</h2>
              <p className="text-white/80 mb-4">{companyInfo.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-white/60 text-sm">Founded</div>
                  <div className="text-white font-semibold">{companyInfo.founded}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Headquarters</div>
                  <div className="text-white font-semibold">{companyInfo.headquarters}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Employees</div>
                  <div className="text-white font-semibold">{companyInfo.employees}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Market Share</div>
                  <div className="text-white font-semibold">{companyInfo.marketShare}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        <div className="products-grid">
          {brandProducts.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Header */}
              <div className="product-header">
                <span className="product-icon">👓</span>
                <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              {/* Product Details */}
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              
              {/* Rating */}
              <div className="rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < Math.round(product.rating) ? 'star-filled' : 'star-empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">{product.rating}</span>
              </div>
              
              {/* Price */}
              <div className="product-price">
                ${product.price}
                {product.originalPrice > product.price && (
                  <span className="text-white/60 text-lg line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Key Features */}
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">Key Features:</div>
                <ul className="space-y-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-white/80 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Actions */}
              <div className="product-actions">
                <Link 
                  href={`/products/${product.id}`}
                  className="action-btn action-btn-details"
                >
                  View Details
                </Link>
                <button 
                  className="action-btn action-btn-compare"
                  aria-label={`Add ${product.name} to comparison`}
                >
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Other Brands */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Explore Other Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...new Set(arGlassesData.map(p => p.brand))]
              .filter(b => b !== brandName)
              .slice(0, 8)
              .map((otherBrand) => {
                const brandSlug = otherBrand.toLowerCase().replace(/\s+/g, '-');
                const brandProductCount = arGlassesData.filter(p => p.brand === otherBrand).length;
                
                return (
                  <Link
                    key={otherBrand}
                    href={`/brand/${brandSlug}`}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all text-center"
                  >
                    <div className="text-white font-semibold">{otherBrand}</div>
                    <div className="text-white/60 text-sm mt-1">
                      {brandProductCount} {brandProductCount === 1 ? 'model' : 'models'}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export async function generateStaticParams() {
  // Get unique brands from products
  const brands = [...new Set(arGlassesData.map(p => p.brand))];
  
  return brands.map((brand) => ({
    brand: brand.toLowerCase().replace(/\s+/g, '-'),
  }));
}