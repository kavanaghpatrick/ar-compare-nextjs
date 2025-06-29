import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog/posts';
import { blogCategories } from '@/data/blog/categories';

export default function sitemapBlog(): MetadataRoute.Sitemap {
  const baseUrl = 'https://arcompare.com';
  
  // Blog main page
  const blogMainPage = {
    url: `${baseUrl}/blog`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  };

  // Individual blog posts
  const blogPostPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.publishedAt).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  // Blog category pages
  const categoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/blog?category=${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // RSS feed
  const rssFeed = {
    url: `${baseUrl}/blog/feed.xml`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.5,
  };

  return [
    blogMainPage,
    ...blogPostPages,
    ...categoryPages,
    rssFeed,
  ];
}