import { notFound } from 'next/navigation';
import { EnhancedProduct } from '@/types';
import { ProductPageClient } from '@/components/ProductPageClient';
import { ProductStructuredData } from '@/components/ProductStructuredData';
import { SEOOptimization } from '@/components/SEOOptimization';
import { PerformanceOptimization } from '@/components/PerformanceOptimization';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<EnhancedProduct | null> {
  try {
    // During build time, use direct data import instead of API fetch
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_API_URL) {
      // Import the enhanced data directly for static generation
      const { default: enhancedArGlassesData } = await import('@/data/products');
      return enhancedArGlassesData.find(p => p.id === id) || null;
    }
    
    // Use environment variable for API URL, or construct it based on VERCEL_URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to direct data import if API fails
    try {
      const { default: enhancedArGlassesData } = await import('@/data/products');
      return enhancedArGlassesData.find(p => p.id === id) || null;
    } catch (fallbackError) {
      console.error('Fallback data import failed:', fallbackError);
      return null;
    }
  }
}

// Generate static params for all products
export async function generateStaticParams() {
  const { default: enhancedArGlassesData } = await import('@/data/products');
  return enhancedArGlassesData.map((product) => ({
    id: product.id,
  }));
}

// Removed renderStars function as it's now handled by ProductHero component

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Generate breadcrumbs for SEO
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/' },
    { name: product.brand, url: `/brand/${product.brand.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.name, url: `/products/${product.id}` }
  ];

  return (
    <>
      {/* SEO and Performance Optimization Head Elements */}
      <ProductStructuredData product={product} />
      <SEOOptimization 
        product={product}
        pageType="product"
        breadcrumbs={breadcrumbs}
      />
      <PerformanceOptimization 
        product={product}
        pageType="product"
        enableLazyLoading={true}
        enableCriticalCSS={true}
        enableResourceHints={true}
      />
      
      {/* Main Product Content */}
      <ProductPageClient product={product} />
    </>
  );
}