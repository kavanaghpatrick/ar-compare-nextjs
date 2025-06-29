import { MetadataRoute } from 'next';
import { BlogPost } from '@/types';
import { blogPosts } from '@/data/blog/posts';

export class BlogSitemap {
  private posts: BlogPost[];
  private baseUrl: string;

  constructor(posts: BlogPost[], baseUrl: string) {
    this.posts = posts;
    this.baseUrl = baseUrl;
  }

  /**
   * Generate comprehensive sitemap entries for blog posts
   */
  generateBlogSitemap(): MetadataRoute.Sitemap {
    const blogEntries = this.posts.map((post) => ({
      url: `${this.baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: this.determineChangeFrequency(post),
      priority: this.calculatePriority(post),
    }));

    // Add blog index page
    const blogIndex = {
      url: `${this.baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    };

    // Add category pages
    const categories = [...new Set(this.posts.map(post => post.category))];
    const categoryEntries = categories.map(category => ({
      url: `${this.baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [blogIndex, ...categoryEntries, ...blogEntries];
  }

  /**
   * Determine change frequency based on post characteristics
   */
  private determineChangeFrequency(post: BlogPost): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    const now = new Date();
    const publishedDate = new Date(post.publishedAt);
    const daysSincePublished = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));

    // Featured posts and recent posts change more frequently
    if (post.featured) {
      return 'weekly';
    }

    // Recent posts (within 30 days) change more frequently
    if (daysSincePublished < 30) {
      return 'weekly';
    }

    // Guides and evergreen content changes less frequently
    if (post.category.toLowerCase() === 'guides') {
      return 'monthly';
    }

    // Reviews might get updated with new information
    if (post.category.toLowerCase() === 'reviews') {
      return 'monthly';
    }

    // Older posts change less frequently
    return 'yearly';
  }

  /**
   * Calculate priority score based on post characteristics
   */
  private calculatePriority(post: BlogPost): number {
    let priority = 0.5;

    // Featured posts get higher priority
    if (post.featured) {
      priority += 0.3;
    }

    // Recent posts get priority boost
    const now = new Date();
    const publishedDate = new Date(post.publishedAt);
    const daysSincePublished = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSincePublished < 7) {
      priority += 0.2;
    } else if (daysSincePublished < 30) {
      priority += 0.1;
    }

    // Category-based priority
    switch (post.category.toLowerCase()) {
      case 'guides':
        priority += 0.15; // Guides are valuable evergreen content
        break;
      case 'reviews':
        priority += 0.1; // Reviews are important for purchase decisions
        break;
      case 'analysis':
        priority += 0.05; // Analysis provides insights
        break;
    }

    // Longer read time might indicate more comprehensive content
    if (post.readTime > 10) {
      priority += 0.05;
    }

    // Ensure priority stays within bounds
    return Math.min(Math.max(priority, 0.1), 1.0);
  }

  /**
   * Generate blog-specific sitemap with enhanced metadata
   */
  static generateEnhancedBlogSitemap(baseUrl: string): MetadataRoute.Sitemap {
    const blogSitemap = new BlogSitemap(blogPosts, baseUrl);
    return blogSitemap.generateBlogSitemap();
  }

  /**
   * Get blog statistics for sitemap generation
   */
  getBlogStats() {
    return {
      totalPosts: this.posts.length,
      featuredPosts: this.posts.filter(post => post.featured).length,
      categories: [...new Set(this.posts.map(post => post.category))].length,
      averageReadTime: Math.round(
        this.posts.reduce((sum, post) => sum + post.readTime, 0) / this.posts.length
      ),
      dateRange: {
        oldest: new Date(Math.min(...this.posts.map(post => new Date(post.publishedAt).getTime()))),
        newest: new Date(Math.max(...this.posts.map(post => new Date(post.publishedAt).getTime()))),
      }
    };
  }
}