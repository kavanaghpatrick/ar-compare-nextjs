import { Metadata } from 'next';
import arGlassesData from '@/data/products';

interface ProductLayoutProps {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = arGlassesData.find(p => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ar-compare.com' 
    : 'http://localhost:3000';

  const title = `${product.name} - ${product.brand} ${product.model}`;
  const description = `${product.description} Price: $${product.price}. Compare specs, reviews, and features. ${product.keyFeatures?.slice(0, 3).join(', ')}.`;
  const keywords = [
    product.brand,
    product.model,
    product.name,
    product.category,
    'AR glasses',
    'smart glasses',
    'augmented reality',
    'review',
    'specs',
    'price',
    ...product.keyFeatures || []
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/products/${id}`,
      images: [
        {
          url: product.imageUrl || '/og-product-default.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: 'AR Compare',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl || '/twitter-product-default.jpg'],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': product.currency,
      'product:availability': product.availability,
      'product:brand': product.brand,
      'product:category': product.category,
      'product:condition': 'new',
    },
  };
}

export async function generateStaticParams() {
  return arGlassesData.map((product) => ({
    id: product.id,
  }));
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}