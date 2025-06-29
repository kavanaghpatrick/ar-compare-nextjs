import { Metadata } from 'next';
import { Product } from '@/types';

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://ar-compare.com' 
  : 'http://localhost:3000';

export const defaultMetadata: Metadata = {
  title: {
    default: 'AR Compare - Compare AR Glasses & Smart Glasses',
    template: '%s | AR Compare'
  },
  description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews for Xreal, Rokid, Viture, RayNeo, and more.',
  keywords: [
    'AR glasses',
    'smart glasses',
    'augmented reality',
    'product comparison',
    'XR glasses',
    'wearable tech',
    'AR headset',
    'mixed reality'
  ],
  authors: [{ name: 'AR Compare Team' }],
  creator: 'AR Compare',
  publisher: 'AR Compare',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'AR Compare',
    title: 'AR Compare - Compare AR Glasses & Smart Glasses',
    description: 'Compare the latest AR glasses and smart glasses with detailed specifications, prices, and reviews.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AR Compare - Product Comparison Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR Compare - Compare AR Glasses & Smart Glasses',
    description: 'Compare the latest AR glasses and smart glasses with detailed specifications and reviews.',
    images: ['/twitter-image.jpg'],
    creator: '@arcompare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generateProductMetadata(product: Product, path: string): Metadata {
  const title = `${product.name} - ${product.brand} ${product.model}`;
  const description = `${product.description} Price: $${product.price}. Compare specs, reviews, and features. ${product.keyFeatures?.slice(0, 3).join(', ')}.`;
  const keywords = [
    product.brand,
    product.model,
    product.name,
    product.category,
    'AR glasses',
    'smart glasses',
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
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}${path}`,
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

export function generateComparisonMetadata(products: Product[]): Metadata {
  const productNames = products.map(p => p.name).join(' vs ');
  const title = products.length > 0 
    ? `Compare ${productNames} - AR Glasses Comparison`
    : 'Compare AR Glasses - Side by Side Comparison';
  
  const description = products.length > 0
    ? `Compare ${productNames} side by side. Detailed specifications, prices, and features to help you choose the perfect AR glasses.`
    : 'Compare AR glasses and smart glasses side by side. Detailed specifications, prices, and reviews to help you choose the perfect AR headset.';

  return {
    title,
    description,
    keywords: [
      'AR glasses comparison',
      'smart glasses compare',
      'side by side comparison',
      ...products.flatMap(p => [p.brand, p.model])
    ],
    alternates: {
      canonical: '/compare',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/compare`,
      images: [
        {
          url: '/og-compare.jpg',
          width: 1200,
          height: 630,
          alt: 'AR Compare - Product Comparison Tool',
        },
      ],
      siteName: 'AR Compare',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-compare.jpg'],
    },
  };
}

export function generateCategoryMetadata(category: string): Metadata {
  const title = `${category} AR Glasses - Compare & Reviews`;
  const description = `Compare the best ${category.toLowerCase()} AR glasses. Find detailed specifications, prices, and reviews for ${category.toLowerCase()} smart glasses and AR headsets.`;

  return {
    title,
    description,
    keywords: [
      `${category} AR glasses`,
      `${category} smart glasses`,
      'AR glasses comparison',
      'augmented reality',
      'product reviews'
    ],
    alternates: {
      canonical: `/category/${category.toLowerCase().replace(' ', '-')}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/category/${category.toLowerCase().replace(' ', '-')}`,
      siteName: 'AR Compare',
    },
  };
}

export function generateBrandMetadata(brand: string): Metadata {
  const title = `${brand} AR Glasses - Compare Models & Reviews`;
  const description = `Compare all ${brand} AR glasses and smart glasses. Find detailed specifications, prices, and reviews for ${brand} AR headsets and XR devices.`;

  return {
    title,
    description,
    keywords: [
      `${brand} AR glasses`,
      `${brand} smart glasses`,
      `${brand} reviews`,
      'AR glasses comparison',
      'augmented reality'
    ],
    alternates: {
      canonical: `/brand/${brand.toLowerCase().replace(' ', '-')}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/brand/${brand.toLowerCase().replace(' ', '-')}`,
      siteName: 'AR Compare',
    },
  };
}