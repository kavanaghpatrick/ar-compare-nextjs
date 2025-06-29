'use client';

import { useMemo } from 'react';
import { EnhancedProduct } from '@/types';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOOptimizationProps {
  product?: EnhancedProduct;
  products?: EnhancedProduct[];
  pageType: 'home' | 'product' | 'category' | 'brand' | 'comparison';
  category?: string;
  brand?: string;
  breadcrumbs?: BreadcrumbItem[];
  baseUrl?: string;
}

export function SEOOptimization({ 
  product, 
  products = [], 
  pageType, 
  category, 
  brand, 
  breadcrumbs = [],
  baseUrl = 'https://ar-compare.com'
}: SEOOptimizationProps) {
  
  const structuredData = useMemo(() => {
    const schemas = [];

    // Website Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AR Compare",
      "url": baseUrl,
      "description": "Compare AR glasses and smart glasses - detailed specs, prices, and reviews",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AR Compare",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 180,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/arcompare",
          "https://linkedin.com/company/arcompare"
        ]
      }
    };
    schemas.push(websiteSchema);

    // Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${baseUrl}${item.url}`
        }))
      };
      schemas.push(breadcrumbSchema);
    }

    // Page-specific schemas
    switch (pageType) {
      case 'home':
        // FAQ Schema for home page
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What are AR glasses?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AR glasses, or augmented reality glasses, are wearable devices that overlay digital information onto the real world. They combine cameras, displays, and sensors to provide an enhanced view of your surroundings with digital content seamlessly integrated."
              }
            },
            {
              "@type": "Question",
              "name": "Which AR glasses are best for gaming?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For gaming, look for AR glasses with high refresh rates (90Hz+), low latency (<20ms), and wide field of view. Top choices include Xreal One Pro with 57° FOV and 3ms latency, and Viture Pro XR with 120Hz refresh rate."
              }
            },
            {
              "@type": "Question",
              "name": "How much do AR glasses cost?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AR glasses range from $219 for budget options like RayNeo Air 3s to $649+ for premium models like Xreal One Pro. Most mid-range options with good features cost between $400-600."
              }
            },
            {
              "@type": "Question",
              "name": "Are AR glasses worth buying in 2024?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, 2024 AR glasses offer significant improvements in display quality, battery life, and software. They're particularly valuable for mobile productivity, gaming, and entertainment, with mature ecosystems from brands like Xreal and Viture."
              }
            }
          ]
        };
        schemas.push(faqSchema);
        break;

      case 'category':
        if (category && products.length > 0) {
          const categoryProducts = products.slice(0, 10); // Limit for performance
          const collectionSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category} AR Glasses`,
            "description": `Compare the best ${category.toLowerCase()} AR glasses and smart glasses with detailed specifications and reviews.`,
            "url": `${baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categoryProducts.length,
              "itemListElement": categoryProducts.map((prod, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "@id": `${baseUrl}/products/${prod.id}`,
                  "name": prod.name,
                  "image": prod.image,
                  "description": prod.description,
                  "offers": {
                    "@type": "Offer",
                    "price": prod.price,
                    "priceCurrency": prod.currency
                  }
                }
              }))
            }
          };
          schemas.push(collectionSchema);
        }
        break;

      case 'brand':
        if (brand && products.length > 0) {
          const brandProducts = products.slice(0, 10);
          const brandSchema = {
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": brand,
            "url": `${baseUrl}/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`,
            "description": `${brand} AR glasses and smart glasses collection with detailed comparisons and reviews.`,
            "makesOffer": brandProducts.map(prod => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "@id": `${baseUrl}/products/${prod.id}`,
                "name": prod.name
              },
              "price": prod.price,
              "priceCurrency": prod.currency
            }))
          };
          schemas.push(brandSchema);
        }
        break;

      case 'comparison':
        if (products.length > 1) {
          const comparisonSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `Compare ${products.map(p => p.name).join(' vs ')}`,
            "description": `Detailed side-by-side comparison of ${products.map(p => p.name).join(', ')} AR glasses with specifications, pricing, and features.`,
            "url": `${baseUrl}/compare`,
            "mainEntity": {
              "@type": "ItemList",
              "name": "AR Glasses Comparison",
              "description": "Side-by-side comparison of AR glasses",
              "itemListElement": products.map((prod, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "@id": `${baseUrl}/products/${prod.id}`,
                  "name": prod.name,
                  "description": prod.description,
                  "image": prod.image,
                  "offers": {
                    "@type": "Offer",
                    "price": prod.price,
                    "priceCurrency": prod.currency
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": prod.rating,
                    "bestRating": 5
                  }
                }
              }))
            },
            "about": [
              {
                "@type": "Thing",
                "name": "AR Glasses Comparison"
              },
              {
                "@type": "Thing",
                "name": "Smart Glasses Review"
              }
            ]
          };
          schemas.push(comparisonSchema);
        }
        break;
    }

    return schemas;
  }, [product, products, pageType, category, brand, breadcrumbs, baseUrl]);

  // Generate JSON-LD for social media optimization
  const socialOptimization = useMemo(() => {
    if (!product) return null;

    return {
      // Twitter Card optimization
      twitterCard: {
        card: 'summary_large_image',
        site: '@arcompare',
        title: `${product.name} - ${product.brand} AR Glasses Review`,
        description: `${product.description} Price: $${product.price}. ${product.customerInsights?.overallSentiment || 'Compare specs and features.'} ${product.keyFeatures.slice(0, 2).join(', ')}.`,
        image: product.image,
        imageAlt: `${product.name} - ${product.brand} AR Glasses`,
        creator: '@arcompare'
      },

      // Open Graph optimization
      openGraph: {
        type: 'product',
        title: `${product.name} - ${product.brand} AR Glasses`,
        description: `${product.description} Starting at $${product.price}. ${product.customerInsights?.topPros?.slice(0, 2).join(', ') || 'Compare features and reviews.'} Available ${product.availability.toLowerCase()}.`,
        url: `${baseUrl}/products/${product.id}`,
        siteName: 'AR Compare',
        locale: 'en_US',
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: `${product.name} product image`,
            type: 'image/jpeg'
          }
        ],
        // Product-specific OG tags
        'product:price:amount': product.price.toString(),
        'product:price:currency': product.currency,
        'product:availability': product.availability,
        'product:condition': 'new',
        'product:brand': product.brand,
        'product:category': product.category,
        'product:retailer': 'AR Compare'
      },

      // Additional meta tags for rich snippets
      additionalMeta: {
        'product:rating:value': product.rating.toString(),
        'product:rating:scale': '5',
        'product:review:count': product.amazon?.reviewCount?.replace(/[^0-9]/g, '') || '50',
        'article:author': 'AR Compare Editorial Team',
        'article:publisher': 'AR Compare',
        'article:section': 'Technology Reviews',
        'article:tag': [product.brand, product.category, 'AR Glasses', 'Smart Glasses'].join(',')
      }
    };
  }, [product, baseUrl]);

  return (
    <>
      {/* Structured Data JSON-LD */}
      {structuredData.map((schema, index) => (
        <script
          key={`seo-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}

      {/* Additional meta tags for social optimization */}
      {socialOptimization && (
        <>
          {/* Twitter Card meta tags */}
          <meta name="twitter:card" content={socialOptimization.twitterCard.card} />
          <meta name="twitter:site" content={socialOptimization.twitterCard.site} />
          <meta name="twitter:title" content={socialOptimization.twitterCard.title} />
          <meta name="twitter:description" content={socialOptimization.twitterCard.description} />
          <meta name="twitter:image" content={socialOptimization.twitterCard.image} />
          <meta name="twitter:image:alt" content={socialOptimization.twitterCard.imageAlt} />
          <meta name="twitter:creator" content={socialOptimization.twitterCard.creator} />
          
          {/* Additional meta tags */}
          {Object.entries(socialOptimization.additionalMeta).map(([key, value]) => (
            <meta key={key} name={key} content={value} />
          ))}
        </>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      
      {/* DNS prefetch for likely destinations */}
      <link rel="dns-prefetch" href="https://amazon.com" />
      <link rel="dns-prefetch" href="https://google-analytics.com" />
      
      {/* Preload critical resources */}
      <link 
        rel="preload" 
        href="/fonts/geist-sans.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
    </>
  );
}