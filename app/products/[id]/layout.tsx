import { Metadata } from 'next';
import { EnhancedProduct } from '@/types';
import { generateEnhancedProductMetadata } from '@/lib/seo';

interface ProductLayoutProps {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}

async function getProductForMetadata(id: string): Promise<EnhancedProduct | null> {
  try {
    // For metadata generation, we can import directly to avoid fetch issues during build
    const arGlassesData = await import('@/data/products');
    return arGlassesData.default.find((p: EnhancedProduct) => p.id === id) || null;
  } catch (error) {
    console.error('Error loading product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForMetadata(id);

  if (!product) {
    return {
      title: 'Product Not Found - AR Compare',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Use the enhanced SEO metadata generator
  return generateEnhancedProductMetadata(product, `/products/${id}`);
}

export async function generateStaticParams() {
  try {
    const arGlassesData = await import('@/data/products');
    return arGlassesData.default.map((product: EnhancedProduct) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}