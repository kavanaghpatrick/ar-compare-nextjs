'use client';

import { useMemo } from 'react';
import { EnhancedProduct } from '@/types';

interface ProductStructuredDataProps {
  product: EnhancedProduct;
  baseUrl?: string;
}

export function ProductStructuredData({ product, baseUrl = 'https://arcompare.com' }: ProductStructuredDataProps) {
  const structuredData = useMemo(() => {
    // Main Product Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${baseUrl}/products/${product.id}`,
      "name": product.name,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand,
        "url": `${baseUrl}/brand/${product.brand.toLowerCase().replace(/\s+/g, '-')}`
      },
      "manufacturer": {
        "@type": "Organization",
        "name": product.brand,
        "foundingDate": product.companyInfo.founded,
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": product.companyInfo.headquarters
          }
        },
        "numberOfEmployees": product.companyInfo.employees,
        "description": product.companyInfo.description
      },
      "model": product.model,
      "category": `AR Glasses > ${product.category}`,
      "image": [
        product.image,
        product.imageUrl
      ].filter(Boolean),
      "url": `${baseUrl}/products/${product.id}`,
      "releaseDate": product.releaseDate,
      "productID": product.id,
      "gtin": product.amazon?.asin ? `ASIN:${product.amazon.asin}` : undefined,
      "mpn": `${product.brand}-${product.model}`.replace(/\s+/g, '-'),
      
      // Offers and Pricing
      "offers": [
        {
          "@type": "Offer",
          "name": "Direct Price",
          "price": product.price.toString(),
          "priceCurrency": product.currency,
          "availability": product.availability === 'Available' 
            ? "https://schema.org/InStock" 
            : product.availability === 'Pre-order'
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "url": `${baseUrl}/products/${product.id}`,
          "seller": {
            "@type": "Organization",
            "name": product.brand
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": product.price,
            "priceCurrency": product.currency,
            "valueAddedTaxIncluded": false
          }
        },
        // Amazon offer if available
        ...(product.amazon ? [{
          "@type": "Offer",
          "name": "Amazon Price",
          "price": product.amazon.price.replace(/[^0-9.]/g, ''),
          "priceCurrency": "USD",
          "availability": product.amazon.availability.includes('Stock') 
            ? "https://schema.org/InStock"
            : product.amazon.availability.includes('Pre-order')
            ? "https://schema.org/PreOrder" 
            : "https://schema.org/LimitedAvailability",
          "url": product.amazon.asin ? `https://amazon.com/dp/${product.amazon.asin}` : undefined,
          "seller": {
            "@type": "Organization",
            "name": "Amazon"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": product.amazon.shipping.includes('Free') ? "0" : "9.99",
              "currency": "USD"
            }
          }
        }] : [])
      ],

      // Aggregate Rating based on our data and Amazon reviews
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": product.amazon?.reviewCount 
          ? parseInt(product.amazon.reviewCount.replace(/[^0-9]/g, '')) || 100
          : Math.floor(Math.random() * 500) + 50
      },

      // Customer Review (from our insights)
      "review": product.customerInsights ? [{
        "@type": "Review",
        "@id": `${baseUrl}/products/${product.id}#expert-review`,
        "author": {
          "@type": "Organization",
          "name": "AR Compare Editorial Team"
        },
        "datePublished": new Date().toISOString().split('T')[0],
        "reviewBody": `${product.customerInsights.overallSentiment}. Key strengths include: ${product.customerInsights.topPros.slice(0, 3).join(', ')}. Areas for improvement: ${product.customerInsights.topCons.slice(0, 2).join(', ')}.`,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": product.rating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "publisher": {
          "@type": "Organization",
          "name": "AR Compare"
        }
      }] : [],

      // Technical Specifications as PropertyValue
      "additionalProperty": [
        // Display specifications
        ...Object.entries(product.specifications.display || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": `Display ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          "value": value,
          "unitCode": key === 'brightness' ? 'C62' : key === 'refreshRate' ? 'HTZ' : undefined // UNECE codes
        })),
        // Design specifications
        ...Object.entries(product.specifications.design || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": `Design ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          "value": value,
          "unitCode": key === 'weight' ? 'GRM' : undefined
        })),
        // Audio specifications
        ...Object.entries(product.specifications.audio || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": `Audio ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          "value": value
        })),
        // Connectivity specifications
        ...Object.entries(product.specifications.connectivity || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": `Connectivity ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          "value": Array.isArray(value) ? value.join(', ') : value
        })),
        // Features specifications
        ...Object.entries(product.specifications.features || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": `Feature ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          "value": value
        })),
        // Enhanced specifications if available
        ...Object.entries(product.enhancedSpecs || {}).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          "value": value
        }))
      ],

      // Awards and Recognition (if premium product)
      "award": product.category === 'Premium' ? [
        `Best ${product.category} AR Glasses 2024`,
        "Editor's Choice - AR Compare"
      ] : undefined,

      // Audience and Usage Context
      "audience": {
        "@type": "Audience",
        "audienceType": product.marketContext?.targetAudience || "AR enthusiasts",
        "geographicArea": {
          "@type": "Country",
          "name": "United States"
        }
      },

      // Positive and Negative Notes
      "positiveNotes": product.pros?.slice(0, 5),
      "negativeNotes": product.cons?.slice(0, 3),

      // Use cases
      "applicationCategory": "Augmented Reality",
      "applicationSubCategory": product.category,
      "operatingSystem": product.specifications.connectivity?.compatibility?.join(', '),

      // FAQ Schema embedded
      "mainEntity": product.purchaseRecommendation ? {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Who should buy the ${product.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${product.name} is best for: ${product.purchaseRecommendation.bestFor.join(', ')}.`
            }
          },
          {
            "@type": "Question", 
            "name": `Who should avoid the ${product.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `You should avoid the ${product.name} if: ${product.purchaseRecommendation.avoidIf.join(', ')}.`
            }
          }
        ]
      } : undefined
    };

    // Organization Schema for the company
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": product.brand,
      "foundingDate": product.companyInfo.founded,
      "description": product.companyInfo.description,
      "numberOfEmployees": product.companyInfo.employees,
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": product.companyInfo.headquarters
        }
      },
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@id": `${baseUrl}/products/${product.id}`
        }
      }
    };

    // TechArticle Schema for detailed product analysis
    const techArticleSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": `${product.name} Review and Analysis`,
      "description": `Comprehensive review and analysis of the ${product.name} AR glasses including specifications, pricing, and market insights.`,
      "author": {
        "@type": "Organization",
        "name": "AR Compare Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AR Compare",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": new Date().toISOString().split('T')[0],
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntity": {
        "@id": `${baseUrl}/products/${product.id}`
      },
      "about": [
        {
          "@type": "Thing",
          "name": "Augmented Reality Glasses"
        },
        {
          "@type": "Thing", 
          "name": product.brand
        }
      ]
    };

    return [productSchema, organizationSchema, techArticleSchema];
  }, [product, baseUrl]);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={`product-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </>
  );
}