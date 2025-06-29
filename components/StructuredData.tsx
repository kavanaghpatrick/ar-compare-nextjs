import { Product } from '@/types';
import { useMemo } from 'react';

interface StructuredDataProps {
  product?: Product;
  products?: Product[];
  page?: 'home' | 'product' | 'comparison';
}

export function StructuredData({ product, products, page = 'home' }: StructuredDataProps) {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://arcompare.com' 
    : 'http://localhost:3000';

  // Organization structured data
  const organizationData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AR Compare",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Compare the latest AR glasses and smart glasses with detailed specifications, prices, and reviews.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/arcompare",
      "https://linkedin.com/company/arcompare"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@arcompare.com"
    }
  }), [siteUrl]);

  // Website structured data
  const websiteData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AR Compare",
    "url": siteUrl,
    "description": "Compare AR glasses and smart glasses - detailed specs, prices, and reviews",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }), [siteUrl]);

  // Product structured data
  const getProductStructuredData = useMemo(() => (prod: Product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": prod.name,
    "description": prod.description,
    "brand": {
      "@type": "Brand",
      "name": prod.brand
    },
    "model": prod.model,
    "image": prod.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": prod.price,
      "priceCurrency": prod.currency,
      "availability": prod.availability === 'Available' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": prod.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": Math.floor(Math.random() * 1000) + 50 // Placeholder
    },
    "category": prod.category,
    "releaseDate": prod.releaseDate,
    "additionalProperty": [
      ...Object.entries(prod.specifications?.display || {}).map(([key, value]) => ({
        "@type": "PropertyValue",
        "name": `Display ${key}`,
        "value": value
      })),
      ...Object.entries(prod.specifications?.design || {}).map(([key, value]) => ({
        "@type": "PropertyValue",
        "name": `Design ${key}`,
        "value": value
      }))
    ]
  }), []);

  // FAQ structured data for home page
  const faqData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are AR glasses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AR glasses, or augmented reality glasses, are wearable devices that overlay digital information onto the real world. They combine cameras, displays, and sensors to provide an enhanced view of your surroundings."
        }
      },
      {
        "@type": "Question",
        "name": "Which AR glasses are best for gaming?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For gaming, look for AR glasses with high refresh rates (90Hz+), low latency, and 6DoF tracking. Popular options include Xreal One Pro and RayNeo X3 Pro."
        }
      },
      {
        "@type": "Question",
        "name": "How much do AR glasses cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AR glasses range from $269 for budget options like RayNeo Air 3s to $899+ for premium models like RayNeo X3 Pro. Most mid-range options cost between $400-600."
        }
      }
    ]
  }), []);

  const structuredData = useMemo(() => {
    const data: Record<string, unknown>[] = [organizationData, websiteData];

    if (page === 'home') {
      data.push(faqData);
    }

    if (product) {
      data.push(getProductStructuredData(product));
    }

    if (products && products.length > 0) {
      const productListData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((prod, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": getProductStructuredData(prod)
        }))
      };
      data.push(productListData);
    }

    return data;
  }, [page, product, products, organizationData, websiteData, faqData, getProductStructuredData]);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}
    </>
  );
}