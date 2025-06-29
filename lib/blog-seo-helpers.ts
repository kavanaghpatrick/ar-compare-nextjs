import { Metadata } from 'next';
import { BlogPost } from '@/types';
import { SEOMetaGenerator, TitleFormulas } from './seo-meta-generator';

/**
 * Generates optimized metadata for individual blog posts
 */
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  // Use existing SEO data if available, otherwise generate
  const metaTitle = post.seo?.metaTitle || generateOptimizedTitle(post);
  const metaDescription = post.seo?.metaDescription || generateOptimizedDescription(post);
  const keywords = post.seo?.keywords || generateKeywords(post);

  return SEOMetaGenerator.generateMetadata({
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    image: post.image,
    imageAlt: post.imageAlt,
    url: `/blog/${post.slug}`,
    author: post.author.name,
    publishedAt: post.publishedAt,
    category: post.category,
    tags: post.tags,
    type: 'article'
  });
}

/**
 * Generates compelling titles based on post content and category
 */
function generateOptimizedTitle(post: BlogPost): string {
  const year = new Date().getFullYear();
  
  // Category-based title optimization
  switch (post.category.toLowerCase()) {
    case 'reviews':
      if (post.title.includes('Review')) {
        return TitleFormulas.review(post.title.replace(' Review', '').replace(': The Future of AR Glasses?', ''), year);
      }
      return `${post.title} - Honest Review After Real Testing`;
    
    case 'guides':
      if (post.title.includes('Ultimate Guide')) {
        const topic = post.title.replace('The Ultimate Guide to ', '').replace(' in 2024', '');
        return TitleFormulas.ultimate(topic, year);
      }
      if (post.title.includes('Best')) {
        return `${post.title} - Expert Tested & Ranked`;
      }
      return `${post.title} - Complete Expert Guide`;
    
    case 'analysis':
      if (post.title.includes(' vs ')) {
        return `${post.title} - Detailed Comparison & Winner`;
      }
      return `${post.title} - Expert Analysis & Insights`;
    
    case 'privacy':
      return `${post.title} - Complete Protection Guide ${year}`;
    
    default:
      return `${post.title} | AR Compare Expert Analysis`;
  }
}

/**
 * Generates compelling meta descriptions with CTAs
 */
function generateOptimizedDescription(post: BlogPost): string {
  const baseDescription = post.excerpt;
  
  // Category-specific CTAs
  const ctas = {
    'reviews': 'Read our detailed review',
    'guides': 'Get expert guidance',
    'analysis': 'See our analysis',
    'privacy': 'Learn how to protect yourself',
    'default': 'Read our expert insights'
  };
  
  const cta = ctas[post.category.toLowerCase() as keyof typeof ctas] || ctas.default;
  
  // Generate keyword-rich descriptions based on post content
  const categoryKeywords = {
    'reviews': ['expert review', 'performance test'],
    'guides': ['buying guide', 'expert tips'],
    'analysis': ['comparison', 'detailed analysis'],
    'privacy': ['privacy protection', 'security guide'],
    'default': ['expert insights', 'analysis']
  };
  
  const keywords = categoryKeywords[post.category.toLowerCase() as keyof typeof categoryKeywords] || categoryKeywords.default;
  
  return SEOMetaGenerator.generateDescription(baseDescription, keywords, cta);
}

/**
 * Generates SEO keywords based on post content
 */
function generateKeywords(post: BlogPost): string[] {
  const baseKeywords = [
    'AR glasses',
    'smart glasses', 
    'augmented reality'
  ];
  
  // Add category-specific keywords
  const categoryKeywords = {
    'reviews': ['review', 'test', 'performance', 'analysis'],
    'guides': ['guide', 'buying guide', 'tips', 'recommendations'],
    'analysis': ['comparison', 'analysis', 'versus'],
    'privacy': ['privacy', 'security', 'protection', 'data']
  };
  
  const catKeywords = categoryKeywords[post.category.toLowerCase() as keyof typeof categoryKeywords] || [];
  
  // Extract keywords from title and tags
  const titleKeywords = extractKeywordsFromTitle(post.title);
  const tagKeywords = post.tags.map(tag => tag.toLowerCase());
  
  // Combine and deduplicate
  const allKeywords = [
    ...baseKeywords,
    ...catKeywords,
    ...titleKeywords,
    ...tagKeywords
  ];
  
  return [...new Set(allKeywords)];
}

/**
 * Extracts relevant keywords from post titles
 */
function extractKeywordsFromTitle(title: string): string[] {
  const keywords: string[] = [];
  
  // Brand/product extraction
  const brands = ['xreal', 'rokid', 'tcl', 'viture', 'rayneo', 'microsoft', 'magic leap', 'varjo'];
  brands.forEach(brand => {
    if (title.toLowerCase().includes(brand)) {
      keywords.push(brand);
    }
  });
  
  // Technology terms
  const techTerms = ['oled', 'micro-oled', '6dof', '3dof', 'spatial', 'tracking', 'ar', 'vr', 'mixed reality'];
  techTerms.forEach(term => {
    if (title.toLowerCase().includes(term)) {
      keywords.push(term);
    }
  });
  
  // Price-related terms
  const priceTerms = ['budget', 'cheap', 'affordable', 'premium', 'expensive', 'value'];
  priceTerms.forEach(term => {
    if (title.toLowerCase().includes(term)) {
      keywords.push(term);
    }
  });
  
  return keywords;
}

/**
 * Generates category-specific structured data
 */
export function generateBlogPostStructuredData(post: BlogPost) {
  const baseStructuredData = SEOMetaGenerator.generateStructuredData({
    title: post.title,
    description: post.excerpt,
    image: post.image,
    url: `/blog/${post.slug}`,
    author: post.author.name,
    publishedAt: post.publishedAt,
    category: post.category,
    tags: post.tags,
    type: 'article'
  });

  if (!baseStructuredData) return null;

  // Add review-specific structured data
  if (post.category.toLowerCase() === 'reviews') {
    return {
      ...baseStructuredData,
      '@type': ['Article', 'Review'],
      itemReviewed: {
        '@type': 'Product',
        name: extractProductName(post.title),
        category: 'AR Glasses',
        brand: extractBrandName(post.title)
      }
    };
  }

  // Add guide-specific structured data
  if (post.category.toLowerCase() === 'guides') {
    return {
      ...baseStructuredData,
      '@type': ['Article', 'HowTo'],
      totalTime: `PT${post.readTime}M`
    };
  }

  return baseStructuredData;
}

/**
 * Helper functions for structured data
 */
function extractProductName(title: string): string {
  // Extract product name from review titles
  const reviewMatch = title.match(/^(.+?)\s+Review/i);
  return reviewMatch ? reviewMatch[1] : title;
}

function extractBrandName(title: string): string {
  const brands = ['Xreal', 'Rokid', 'TCL', 'Viture', 'RayNeo', 'Microsoft', 'Magic Leap', 'Varjo'];
  for (const brand of brands) {
    if (title.includes(brand)) {
      return brand;
    }
  }
  return 'Unknown';
}

/**
 * Social media optimization helpers
 */
export function generateSocialMetadata(post: BlogPost) {
  return {
    facebook: {
      title: `${post.title} | AR Compare`,
      description: post.excerpt,
      image: post.image,
      url: `https://ar-compare.com/blog/${post.slug}`
    },
    twitter: {
      title: post.title.length > 60 ? `${post.title.substring(0, 57)}...` : post.title,
      description: post.excerpt.length > 125 ? `${post.excerpt.substring(0, 122)}...` : post.excerpt,
      image: post.image,
      hashtags: post.tags.slice(0, 3).map(tag => tag.replace(/\s+/g, ''))
    },
    linkedin: {
      title: `${post.title} - Professional Analysis`,
      description: `Professional insights: ${post.excerpt}`,
      image: post.image
    }
  };
}

/**
 * A/B testing title variations
 */
export function generateTitleVariations(post: BlogPost): string[] {
  const variations: string[] = [];
  const year = new Date().getFullYear();
  
  // Original title
  variations.push(post.title);
  
  // Add year if not present
  if (!post.title.includes(year.toString())) {
    variations.push(`${post.title} ${year}`);
  }
  
  // Add emotional triggers
  const emotionalTriggers = [
    'That Actually Work',
    'Worth Your Money',
    'You Need to Know',
    'Before You Buy',
    'Experts Recommend'
  ];
  
  emotionalTriggers.forEach(trigger => {
    if (post.category.toLowerCase() === 'guides') {
      variations.push(`${post.title} ${trigger}`);
    }
  });
  
  // Add numbers for lists
  if (post.category.toLowerCase() === 'guides' && !post.title.match(/\d+/)) {
    variations.push(`5 ${post.title.replace('The Ultimate Guide to ', '').replace('Guide', 'Tips')}`);
  }
  
  return variations.slice(0, 5); // Limit to 5 variations
}