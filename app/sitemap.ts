import { MetadataRoute } from 'next';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ar-compare.com' 
    : 'http://localhost:3000';

  // Initialize the ProductSitemap utility
  const productSitemap = new ProductSitemap(arGlassesData, siteUrl);
  
  // Generate enhanced sitemap entries with intelligent priority scoring
  const sitemapEntries = productSitemap.generateProductSitemap();

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
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Convert ProductSitemap entries to MetadataRoute.Sitemap format
  const enhancedEntries = sitemapEntries.map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: entry.priority,
  }));

  return [
    ...staticPages,
    ...enhancedEntries,
  ];
}