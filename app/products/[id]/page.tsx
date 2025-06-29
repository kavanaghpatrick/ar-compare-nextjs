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
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ar-compare.com' 
      : 'http://localhost:3000';
    
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
    return null;
  }
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