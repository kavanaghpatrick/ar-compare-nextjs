/**
 * Social Media Image Optimization for AR Compare Blog
 * Handles optimal image paths, dimensions, and fallbacks for different platforms
 */

export interface SocialImageConfig {
  title: string;
  category?: string;
  author?: string;
  publishedDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export class SocialImageGenerator {
  private static readonly BASE_URL = 'https://ar-compare.com';
  private static readonly IMAGE_BASE_PATH = '/images/blog/social';
  
  // Optimal dimensions for different platforms
  static readonly DIMENSIONS = {
    openGraph: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
    linkedin: { width: 1200, height: 627 },
    facebook: { width: 1200, height: 630 },
    pinterest: { width: 735, height: 1102 },
    instagram: { width: 1080, height: 1080 }
  };

  /**
   * Generates optimized image paths for blog posts
   */
  static generateImagePaths(slug: string, category: string = 'general'): {
    openGraph: string;
    twitter: string;
    fallback: string;
    alt: string;
  } {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    
    return {
      openGraph: `${this.IMAGE_BASE_PATH}/og/${categorySlug}/${slug}-og.jpg`,
      twitter: `${this.IMAGE_BASE_PATH}/twitter/${categorySlug}/${slug}-twitter.jpg`,
      fallback: `${this.IMAGE_BASE_PATH}/fallback/${categorySlug}-default.jpg`,
      alt: this.generateAltText(slug, category)
    };
  }

  /**
   * Generates category-specific default images
   */
  static getCategoryDefaultImages(category: string): {
    openGraph: string;
    twitter: string;
    alt: string;
  } {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    
    const images = {
      reviews: {
        openGraph: `${this.IMAGE_BASE_PATH}/defaults/reviews-og.jpg`,
        twitter: `${this.IMAGE_BASE_PATH}/defaults/reviews-twitter.jpg`,
        alt: 'AR Glasses Expert Review - Performance Testing and Analysis'
      },
      guides: {
        openGraph: `${this.IMAGE_BASE_PATH}/defaults/guides-og.jpg`,
        twitter: `${this.IMAGE_BASE_PATH}/defaults/guides-twitter.jpg`,
        alt: 'AR Glasses Buying Guide - Expert Tips and Recommendations'
      },
      analysis: {
        openGraph: `${this.IMAGE_BASE_PATH}/defaults/analysis-og.jpg`,
        twitter: `${this.IMAGE_BASE_PATH}/defaults/analysis-twitter.jpg`,
        alt: 'AR Technology Analysis - Industry Insights and Comparisons'
      },
      privacy: {
        openGraph: `${this.IMAGE_BASE_PATH}/defaults/privacy-og.jpg`,
        twitter: `${this.IMAGE_BASE_PATH}/defaults/privacy-twitter.jpg`,
        alt: 'AR Glasses Privacy Guide - Security and Data Protection'
      },
      default: {
        openGraph: `${this.IMAGE_BASE_PATH}/defaults/blog-og.jpg`,
        twitter: `${this.IMAGE_BASE_PATH}/defaults/blog-twitter.jpg`,
        alt: 'AR Compare Blog - Expert Smart Glasses Content'
      }
    };

    return images[categorySlug as keyof typeof images] || images.default;
  }

  /**
   * Generates comprehensive alt text for accessibility and SEO
   */
  private static generateAltText(slug: string, category: string): string {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const categoryText = category.toLowerCase();
    
    switch (categoryText) {
      case 'reviews':
        return `${title} - Expert Review with Performance Testing and Analysis`;
      case 'guides':
        return `${title} - Complete Buying Guide with Expert Recommendations`;
      case 'analysis':
        return `${title} - Professional Technology Analysis and Insights`;
      case 'privacy':
        return `${title} - Privacy and Security Protection Guide`;
      default:
        return `${title} - AR Compare Expert Analysis`;
    }
  }

  /**
   * Generates dynamic Open Graph image URLs with parameters
   */
  static generateDynamicOGImage(config: SocialImageConfig): string {
    const params = new URLSearchParams();
    
    params.set('title', config.title);
    if (config.category) params.set('category', config.category);
    if (config.author) params.set('author', config.author);
    if (config.publishedDate) params.set('date', config.publishedDate);
    if (config.primaryColor) params.set('primary', config.primaryColor);
    if (config.secondaryColor) params.set('secondary', config.secondaryColor);
    
    return `/api/og?${params.toString()}`;
  }

  /**
   * Creates fallback image structure with multiple resolutions
   */
  static generateImageSrcSet(basePath: string): {
    srcSet: string;
    sizes: string;
  } {
    return {
      srcSet: [
        `${basePath}?w=600 600w`,
        `${basePath}?w=800 800w`,
        `${basePath}?w=1200 1200w`,
        `${basePath}?w=1600 1600w`,
      ].join(', '),
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    };
  }

  /**
   * Platform-specific image optimization
   */
  static optimizeForPlatform(
    basePath: string, 
    platform: 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'instagram'
  ): {
    url: string;
    width: number;
    height: number;
    alt: string;
  } {
    const dimensions = this.DIMENSIONS[platform === 'facebook' ? 'openGraph' : platform];
    
    return {
      url: `${basePath}?w=${dimensions.width}&h=${dimensions.height}&fit=crop&q=85`,
      width: dimensions.width,
      height: dimensions.height,
      alt: this.generatePlatformAltText(basePath, platform)
    };
  }

  private static generatePlatformAltText(basePath: string, platform: string): string {
    const filename = basePath.split('/').pop() || '';
    const title = filename.replace(/\.(jpg|png|webp)$/i, '').replace(/-/g, ' ');
    
    const platformText = {
      facebook: 'Facebook post image',
      twitter: 'Twitter card image',
      linkedin: 'LinkedIn article image',
      pinterest: 'Pinterest pin image',
      instagram: 'Instagram post image'
    };
    
    return `${title} - ${platformText[platform as keyof typeof platformText] || 'Social media image'}`;
  }

  /**
   * Generates complete social media image metadata
   */
  static generateSocialImageMeta(slug: string, title: string, category: string = 'general') {
    const images = this.generateImagePaths(slug, category);
    const defaults = this.getCategoryDefaultImages(category);
    
    return {
      openGraph: {
        images: [
          {
            url: `${this.BASE_URL}${images.openGraph}`,
            width: this.DIMENSIONS.openGraph.width,
            height: this.DIMENSIONS.openGraph.height,
            alt: images.alt,
            type: 'image/jpeg'
          },
          // Fallback image
          {
            url: `${this.BASE_URL}${defaults.openGraph}`,
            width: this.DIMENSIONS.openGraph.width,
            height: this.DIMENSIONS.openGraph.height,
            alt: defaults.alt,
            type: 'image/jpeg'
          }
        ]
      },
      twitter: {
        images: [
          `${this.BASE_URL}${images.twitter}`,
          `${this.BASE_URL}${defaults.twitter}` // Fallback
        ],
        imageAlt: images.alt
      }
    };
  }
}

// Predefined social media templates for different content types
export const SocialImageTemplates = {
  blogPost: (title: string, category: string) => ({
    title: title.length > 60 ? `${title.substring(0, 57)}...` : title,
    category,
    primaryColor: '#2563eb', // AR Compare blue
    secondaryColor: '#1e40af'
  }),
  
  review: (productName: string, rating?: number) => ({
    title: `${productName} Review`,
    category: 'Review',
    primaryColor: '#059669', // Green for reviews
    secondaryColor: '#047857',
    ...(rating && { rating: rating.toString() })
  }),
  
  guide: (guideTopic: string) => ({
    title: `${guideTopic} Guide`,
    category: 'Guide',
    primaryColor: '#7c3aed', // Purple for guides
    secondaryColor: '#6d28d9'
  }),
  
  comparison: (item1: string, item2: string) => ({
    title: `${item1} vs ${item2}`,
    category: 'Comparison',
    primaryColor: '#dc2626', // Red for comparisons
    secondaryColor: '#b91c1c'
  })
};

// Image optimization settings
export const ImageOptimization = {
  quality: 85,
  format: 'webp' as const,
  fallbackFormat: 'jpeg' as const,
  
  // Lazy loading and performance
  loading: 'lazy' as const,
  decoding: 'async' as const,
  
  // SEO and accessibility
  generateAlt: (title: string, context: string) => 
    `${title} - ${context} | AR Compare Expert Analysis`,
  
  // Image compression settings for different use cases
  compression: {
    hero: { quality: 90, progressive: true },
    thumbnail: { quality: 75, progressive: false },
    social: { quality: 85, progressive: true },
    background: { quality: 70, progressive: true }
  }
};