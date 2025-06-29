import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  type?: 'website' | 'article';
}

export class SEOMetaGenerator {
  private static readonly SITE_NAME = 'AR Compare';
  private static readonly SITE_URL = 'https://ar-compare.com';
  private static readonly TWITTER_HANDLE = '@ARCompare';
  private static readonly FACEBOOK_URL = 'https://www.facebook.com/ARCompare';
  private static readonly DEFAULT_IMAGE = '/images/og-default.jpg';

  /**
   * Generates compelling meta titles with A/B test variations
   */
  static generateTitles(baseTitle: string, keywords: string[] = []): {
    primary: string;
    variations: string[];
  } {
    const year = new Date().getFullYear();
    const keywordSuffix = keywords.length > 0 ? ` - ${keywords[0]}` : '';
    
    return {
      primary: `${baseTitle}${keywordSuffix} | ${this.SITE_NAME}`,
      variations: [
        `${baseTitle} ${year}${keywordSuffix} | Expert Reviews`,
        `🚀 ${baseTitle}${keywordSuffix} - ${this.SITE_NAME}`,
        `Best ${baseTitle} Guide${keywordSuffix} | ${this.SITE_NAME}`,
        `${baseTitle}${keywordSuffix} - Complete Analysis | ${this.SITE_NAME}`
      ]
    };
  }

  /**
   * Creates compelling meta descriptions with CTAs and value propositions
   */
  static generateDescription(
    baseDescription: string,
    keywords: string[] = [],
    cta: string = 'Read our expert analysis'
  ): string {
    const keywordPhrase = keywords.length > 0 ? ` ${keywords.slice(0, 2).join(' and ')}` : '';
    const description = baseDescription.replace(/\.$/, ''); // Remove trailing period
    
    // Ensure description is within 150-160 character limit
    const maxLength = 155;
    const ctaLength = cta.length + 3; // Adding space and punctuation
    const availableLength = maxLength - ctaLength;
    
    let truncatedDescription = description;
    if (description.length > availableLength) {
      truncatedDescription = description.substring(0, availableLength - 3).trim() + '...';
    }
    
    return `${truncatedDescription}${keywordPhrase}. ${cta}.`;
  }

  /**
   * Generates comprehensive Open Graph metadata
   */
  static generateOpenGraph(config: SEOConfig): Metadata['openGraph'] {
    const imageUrl = config.image ? 
      (config.image.startsWith('http') ? config.image : `${this.SITE_URL}${config.image}`) : 
      `${this.SITE_URL}${this.DEFAULT_IMAGE}`;

    return {
      title: config.title,
      description: config.description,
      url: config.url ? `${this.SITE_URL}${config.url}` : this.SITE_URL,
      siteName: this.SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.imageAlt || `${config.title} - ${this.SITE_NAME}`,
        }
      ],
      locale: 'en_US',
      type: config.type || 'website',
      ...(config.publishedAt && {
        publishedTime: config.publishedAt,
      }),
      ...(config.author && {
        authors: [config.author],
      }),
    };
  }

  /**
   * Generates Twitter Card metadata
   */
  static generateTwitterCard(config: SEOConfig): Metadata['twitter'] {
    const imageUrl = config.image ? 
      (config.image.startsWith('http') ? config.image : `${this.SITE_URL}${config.image}`) : 
      `${this.SITE_URL}${this.DEFAULT_IMAGE}`;

    return {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
      creator: this.TWITTER_HANDLE,
      site: this.TWITTER_HANDLE,
    };
  }

  /**
   * Generates structured data for articles
   */
  static generateStructuredData(config: SEOConfig) {
    if (config.type !== 'article') return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.title,
      description: config.description,
      image: config.image ? `${this.SITE_URL}${config.image}` : `${this.SITE_URL}${this.DEFAULT_IMAGE}`,
      author: {
        '@type': 'Organization',
        name: config.author || 'AR Compare Editorial Team',
      },
      publisher: {
        '@type': 'Organization',
        name: this.SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${this.SITE_URL}/images/logo.png`,
        },
      },
      datePublished: config.publishedAt,
      dateModified: config.publishedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.url ? `${this.SITE_URL}${config.url}` : this.SITE_URL,
      },
    };
  }

  /**
   * Generates complete metadata object
   */
  static generateMetadata(config: SEOConfig): Metadata {
    const keywords = config.keywords || [];
    const allKeywords = [
      ...keywords,
      'AR glasses',
      'smart glasses',
      'augmented reality',
      'AR technology',
      'wearable tech'
    ];

    return {
      title: config.title,
      description: config.description,
      keywords: allKeywords.join(', '),
      authors: [{ name: config.author || 'AR Compare Editorial Team' }],
      category: config.category || 'Technology',
      openGraph: this.generateOpenGraph(config),
      twitter: this.generateTwitterCard(config),
      alternates: {
        canonical: config.url ? `${this.SITE_URL}${config.url}` : this.SITE_URL,
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
      other: {
        'article:publisher': this.FACEBOOK_URL,
        'article:author': config.author || 'AR Compare Editorial Team',
        'article:section': config.category || 'Technology',
        ...(config.tags && {
          'article:tag': config.tags.join(', '),
        }),
      },
    };
  }
}

// Predefined SEO templates for different page types
export const SEOTemplates = {
  blog: {
    title: 'AR Glasses Blog 2024 - Expert Reviews & Smart Glasses Guides',
    description: 'Discover the best AR glasses with expert reviews, comprehensive buying guides, and cutting-edge tech insights. Compare features, prices & find your perfect smart glasses solution',
    keywords: ['AR glasses blog', 'smart glasses reviews 2024', 'AR technology guides', 'augmented reality insights', 'best AR glasses', 'AR glasses comparison'],
    cta: 'Explore our expert guides'
  },
  
  review: {
    titleTemplate: (product: string) => `${product} Review 2024 - Complete Analysis & Performance Test`,
    descriptionTemplate: (product: string) => `In-depth ${product} review with performance testing, pros & cons, and buying recommendations. See if this AR glasses model is right for you`,
    keywords: ['AR glasses review', 'smart glasses test', 'AR technology review', 'wearable tech analysis'],
    cta: 'Read our detailed review'
  },
  
  guide: {
    titleTemplate: (topic: string) => `${topic} Guide 2024 - Expert Tips & Recommendations`,
    descriptionTemplate: (topic: string) => `Complete ${topic} guide with expert recommendations, buying tips, and everything you need to make the right choice`,
    keywords: ['AR glasses guide', 'smart glasses buying guide', 'AR technology tips', 'augmented reality advice'],
    cta: 'Get expert guidance'
  },
  
  comparison: {
    titleTemplate: (items: string) => `${items} Comparison 2024 - Which Is Best for You?`,
    descriptionTemplate: (items: string) => `Detailed ${items} comparison with side-by-side analysis, pros & cons, and clear winner recommendations`,
    keywords: ['AR glasses comparison', 'smart glasses vs', 'AR technology comparison', 'best AR glasses'],
    cta: 'See our comparison'
  }
};

// High-converting meta title formulas
export const TitleFormulas = {
  listicle: (topic: string, number: number, year: number = new Date().getFullYear()) => 
    `${number} Best ${topic} in ${year} - Expert Tested & Ranked`,
  
  howTo: (action: string, topic: string) => 
    `How to ${action} ${topic} - Step-by-Step Expert Guide`,
  
  versus: (item1: string, item2: string, year: number = new Date().getFullYear()) => 
    `${item1} vs ${item2} ${year} - Which Should You Choose?`,
  
  ultimate: (topic: string, year: number = new Date().getFullYear()) => 
    `Ultimate ${topic} Guide ${year} - Everything You Need to Know`,
  
  review: (product: string, year: number = new Date().getFullYear()) => 
    `${product} Review ${year} - Honest Analysis After Real Testing`,
};