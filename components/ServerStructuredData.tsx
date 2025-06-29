import arGlassesData from '@/data/products';

export function ServerStructuredData() {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://arcompare.com' 
    : 'http://localhost:3000';

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AR Compare",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Compare AR glasses and smart glasses - detailed specs, prices, and reviews",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@arcompare.com"
    }
  };

  // Website structured data
  const websiteData = {
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
  };

  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best AR glasses in 2024?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best AR glasses include Xreal One Pro for premium features, Rokid AR Spatial for AI integration, and Viture Pro XR for 2D-to-3D conversion. Each offers unique advantages for different use cases."
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
  };

  // Product list structured data
  const productListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": arGlassesData.slice(0, 5).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.fullName,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": product.currency,
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "ratingCount": 100,
          "bestRating": 5,
          "worstRating": 1
        }
      }
    }))
  };

  const structuredData = [organizationData, websiteData, faqData, productListData];

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