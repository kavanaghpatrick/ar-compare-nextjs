import { Metadata } from 'next';
import { Product, EnhancedProduct } from '@/types';

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

// Enhanced SEO functions using EnhancedProduct data
export function generateEnhancedProductMetadata(product: EnhancedProduct, path: string): Metadata {
  // Create rich title with key selling points
  const keyFeature = product.keyFeatures?.[0] || '';
  const title = `${product.name} Review - ${keyFeature} | ${product.brand} AR Glasses`;
  
  // Create compelling description using customer insights and market context
  const customerSentiment = product.customerInsights?.overallSentiment || '';
  const bestFor = product.purchaseRecommendation?.bestFor?.[0] || '';
  const topPro = product.customerInsights?.topPros?.[0] || '';
  const amazonRating = product.amazon?.rating || product.rating;
  
  const description = `${product.description} ${customerSentiment} ${topPro ? `Praised for ${topPro.toLowerCase()}.` : ''} ${bestFor ? `Perfect for ${bestFor.toLowerCase()}.` : ''} Price: $${product.price}${product.amazon?.price ? ` (Amazon: ${product.amazon.price})` : ''}. ${amazonRating ? `Rated ${amazonRating}/5 stars.` : ''} Compare specs, reviews, and prices.`;

  // Enhanced keywords using market context and technical specs
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
    'comparison',
    ...product.keyFeatures || [],
    ...Object.values(product.specifications?.display || {}),
    ...Object.values(product.specifications?.features || {}),
    ...(product.marketContext?.useCases || []),
    ...(product.customerInsights?.topPros?.slice(0, 3) || [])
  ].filter(Boolean);

  return {
    title,
    description: description.substring(0, 160), // Truncate for SEO
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
          url: product.imageUrl || product.image,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.brand} AR Glasses`,
        },
      ],
      siteName: 'AR Compare',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl || product.image],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': product.currency,
      'product:availability': product.availability,
      'product:brand': product.brand,
      'product:category': product.category,
      'product:condition': 'new',
      'product:rating:value': product.rating.toString(),
      'product:rating:scale': '5',
      'product:review:count': product.amazon?.reviewCount?.replace(/[^0-9]/g, '') || '50',
      // Enhanced product attributes
      'product:use_case': product.marketContext?.useCases?.[0] || '',
      'product:target_audience': product.marketContext?.targetAudience || '',
      'product:competitive_advantage': product.marketContext?.competitiveAdvantage || '',
      'product:display_type': product.specifications?.display?.type || '',
      'product:field_of_view': product.specifications?.display?.fov || '',
      'product:weight': product.specifications?.design?.weight || '',
      'product:amazon_asin': product.amazon?.asin || '',
    },
  };
}

export function generateEnhancedComparisonMetadata(products: EnhancedProduct[]): Metadata {
  const productNames = products.map(p => p.name).join(' vs ');
  const title = products.length > 0 
    ? `${productNames} Comparison - Which AR Glasses is Better?`
    : 'Compare AR Glasses - Side by Side Comparison';
  
  // Create rich description using product insights
  const priceRange = products.length > 0 
    ? `$${Math.min(...products.map(p => p.price))} - $${Math.max(...products.map(p => p.price))}`
    : '';
  
  const categories = [...new Set(products.map(p => p.category))].join(', ');
  const topFeatures = products.flatMap(p => p.keyFeatures?.slice(0, 2) || []).slice(0, 4);
  
  const description = products.length > 0
    ? `Compare ${productNames} side by side. ${categories} AR glasses from ${priceRange}. Key features: ${topFeatures.join(', ')}. Detailed specifications, customer reviews, and expert analysis to help you choose the perfect AR glasses.`
    : 'Compare AR glasses and smart glasses side by side. Detailed specifications, prices, and reviews to help you choose the perfect AR headset.';

  // Enhanced keywords from product data
  const keywords = [
    'AR glasses comparison',
    'smart glasses compare',
    'side by side comparison',
    'which AR glasses is better',
    'best AR glasses',
    ...products.flatMap(p => [p.brand, p.model]),
    ...products.flatMap(p => p.keyFeatures?.slice(0, 2) || []),
    ...categories.split(', '),
    priceRange
  ].filter(Boolean);

  return {
    title,
    description: description.substring(0, 160),
    keywords,
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

export function generateEnhancedCategoryMetadata(category: string, products: EnhancedProduct[] = []): Metadata {
  const title = `Best ${category} AR Glasses 2024 - Compare & Reviews`;
  
  // Create rich description using product data
  const priceRange = products.length > 0 
    ? `$${Math.min(...products.map(p => p.price))} - $${Math.max(...products.map(p => p.price))}`
    : '';
  
  const topBrands = [...new Set(products.map(p => p.brand))].slice(0, 4);
  const avgRating = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
    : '';
  
  const topFeatures = products.flatMap(p => p.keyFeatures?.slice(0, 1) || []).slice(0, 3);
  
  const description = `Compare the best ${category.toLowerCase()} AR glasses ${new Date().getFullYear()}. ${products.length} models from ${topBrands.join(', ')} starting at ${priceRange}. ${avgRating ? `Average rating: ${avgRating}/5 stars.` : ''} ${topFeatures.length > 0 ? `Top features: ${topFeatures.join(', ')}.` : ''} Find detailed specifications, prices, and expert reviews.`;

  return {
    title,
    description: description.substring(0, 160),
    keywords: [
      `best ${category} AR glasses`,
      `${category} smart glasses`,
      `${category} AR glasses 2024`,
      'AR glasses comparison',
      'augmented reality',
      'product reviews',
      ...topBrands.map(brand => `${brand} AR glasses`),
      ...topFeatures
    ].filter(Boolean),
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

export function generateEnhancedBrandMetadata(brand: string, products: EnhancedProduct[] = []): Metadata {
  const title = `${brand} AR Glasses - All Models Compared | ${new Date().getFullYear()} Reviews`;
  
  // Create rich description using company and product data
  const companyInfo = products[0]?.companyInfo;
  const priceRange = products.length > 0 
    ? `$${Math.min(...products.map(p => p.price))} - $${Math.max(...products.map(p => p.price))}`
    : '';
  
  const topFeatures = products.flatMap(p => p.keyFeatures?.slice(0, 1) || []).slice(0, 3);
  const avgRating = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
    : '';
  
  const description = `Compare all ${brand} AR glasses and smart glasses. ${companyInfo ? `Founded ${companyInfo.founded}, ${companyInfo.description}` : ''} ${products.length} models from ${priceRange}. ${avgRating ? `Average rating: ${avgRating}/5 stars.` : ''} ${topFeatures.length > 0 ? `Key features: ${topFeatures.join(', ')}.` : ''} Find detailed specifications, prices, and reviews.`;

  return {
    title,
    description: description.substring(0, 160),
    keywords: [
      `${brand} AR glasses`,
      `${brand} smart glasses`,
      `${brand} reviews`,
      `${brand} comparison`,
      'AR glasses comparison',
      'augmented reality',
      ...products.map(p => p.model),
      ...topFeatures,
      companyInfo?.headquarters || ''
    ].filter(Boolean),
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

// Utility function to generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`
    }))
  };
}

// Utility function to generate rich snippet testing data
export function generateRichSnippetTestData(product: EnhancedProduct) {
  return {
    testUrl: `${siteUrl}/products/${product.id}`,
    expectedSnippets: [
      'Product name and brand',
      'Price and availability',
      'Rating and review count',
      'Key features list',
      'Product image',
      'Breadcrumb navigation'
    ],
    structuredDataTypes: [
      'Product',
      'Review',
      'AggregateRating',
      'Offer',
      'Brand',
      'Organization',
      'BreadcrumbList'
    ]
  };
}