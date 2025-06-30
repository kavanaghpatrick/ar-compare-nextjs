import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import arGlassesData from '@/data/products';
import { Product } from '@/types';
import { PageLayout } from '@/components/PageLayout';
import { ProductCardClean } from '@/components/ProductCardClean';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Category mapping
const categoryMap: Record<string, string> = {
  'gaming': 'Gaming',
  'productivity': 'Professional',
  'entertainment': 'Premium',
  'consumer': 'Consumer',
  'premium': 'Premium',
  'professional': 'Professional',
  'entry-level': 'Entry-Level',
  'developer': 'Developer'
};

// Get readable category name from slug
function getCategoryName(slug: string): string {
  return categoryMap[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = getCategoryName(slug);
  
  return {
    title: `${categoryName} AR Glasses - AR Compare`,
    description: `Explore and compare the best ${categoryName.toLowerCase()} AR glasses and smart glasses. Find detailed specs, prices, and reviews for ${categoryName.toLowerCase()} augmented reality devices.`,
    keywords: `${categoryName} AR glasses, ${categoryName} smart glasses, ${categoryName} augmented reality, AR compare`,
    openGraph: {
      title: `${categoryName} AR Glasses - AR Compare`,
      description: `Discover the best ${categoryName.toLowerCase()} AR glasses with detailed comparisons and reviews.`,
      type: 'website',
      url: `/category/${slug}`,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = getCategoryName(slug);
  
  // Filter products by category
  const categoryProducts = arGlassesData.filter(
    product => product.category.toLowerCase() === categoryName.toLowerCase()
  );
  
  // If no products found, check if it's a valid category
  if (categoryProducts.length === 0) {
    // Try alternative mappings
    const alternativeCategories = Object.entries(categoryMap).filter(
      ([key, value]) => key === slug.toLowerCase() || value.toLowerCase() === slug.toLowerCase()
    );
    
    if (alternativeCategories.length === 0) {
      notFound();
    }
  }
  
  // Get category statistics
  const priceRange = categoryProducts.length > 0 ? {
    min: Math.min(...categoryProducts.map(p => p.price)),
    max: Math.max(...categoryProducts.map(p => p.price)),
  } : { min: 0, max: 0 };
  
  const avgRating = categoryProducts.length > 0 
    ? categoryProducts.reduce((sum, p) => sum + p.rating, 0) / categoryProducts.length 
    : 0;
  
  const brands = [...new Set(categoryProducts.map(p => p.brand))];
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <nav className="text-white/60 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Category</span>
            <span className="mx-2">/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {categoryName} AR Glasses
          </h1>
          
          <p className="text-white/80 text-lg mb-6">
            Discover the best {categoryName.toLowerCase()} AR glasses and smart glasses. 
            Compare specs, prices, and features to find the perfect device for your needs.
          </p>
          
          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-white/60 text-sm mb-1">Products</div>
              <div className="text-2xl font-bold text-white">{categoryProducts.length}</div>
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
              <div className="text-white/60 text-sm mb-1">Brands</div>
              <div className="text-2xl font-bold text-white">{brands.length}</div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="products-grid-clean">
            {categoryProducts.map((product) => (
              <ProductCardClean
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              No products found in this category. Try browsing other categories or 
              <Link href="/" className="text-blue-400 hover:text-blue-300 ml-1">
                view all products
              </Link>.
            </p>
          </div>
        )}
        
        {/* Related Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryMap)
              .filter(([key, value]) => value !== categoryName)
              .slice(0, 4)
              .map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all text-center"
                >
                  <div className="text-white font-semibold">{name}</div>
                  <div className="text-white/60 text-sm mt-1">
                    {arGlassesData.filter(p => p.category === name).length} products
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Generate static params for all category slugs
export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({
    slug,
  }));
}