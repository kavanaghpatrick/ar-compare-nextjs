import { MetadataRoute } from 'next';
import arGlassesData from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ar-compare.com' 
    : 'http://localhost:3000';

  // Static pages
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
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Product pages
  const productPages = arGlassesData.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categories = [...new Set(arGlassesData.map(product => product.category))];
  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/category/${category.toLowerCase().replace(' ', '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Brand pages
  const brands = [...new Set(arGlassesData.map(product => product.brand))];
  const brandPages = brands.map((brand) => ({
    url: `${siteUrl}/brand/${brand.toLowerCase().replace(' ', '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
  ];
}