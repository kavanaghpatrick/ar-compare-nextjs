import { MetadataRoute } from 'next';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';
import { BlogSitemap } from '@/lib/blog-sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://arcompare.com' 
    : 'http://localhost:3000';

  // Initialize the ProductSitemap utility
  const productSitemap = new ProductSitemap(arGlassesData, siteUrl);
  
  // Generate enhanced sitemap entries with intelligent priority scoring
  const sitemapEntries = productSitemap.generateProductSitemap();

  // Generate blog sitemap entries
  const blogSitemapEntries = BlogSitemap.generateEnhancedBlogSitemap(siteUrl);

  // Static pages with enhanced priorities
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/market-analysis`,
      lastModified: new Date('2024-12-29'), // Updated with new interactive features
      changeFrequency: 'weekly' as const,
      priority: 0.95, // Boosted priority for enhanced interactive features
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Convert ProductSitemap entries to MetadataRoute.Sitemap format
  const enhancedEntries = sitemapEntries.map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: entry.priority,
  }));

  // Convert BlogSitemap entries to MetadataRoute.Sitemap format
  const blogEntries = blogSitemapEntries.map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: entry.priority,
  }));

  return [
    ...staticPages,
    ...enhancedEntries,
    ...blogEntries,
  ];
}