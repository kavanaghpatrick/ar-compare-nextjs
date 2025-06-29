import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogListingClient } from '@/components/BlogListingClient';
import { blogPosts, getFeaturedPosts, getRecentPosts } from '@/data/blog/posts';
import { blogCategories } from '@/data/blog/categories';
import { SimpleLoading } from '@/components/SimpleLoading';

export const metadata: Metadata = {
  title: 'AR Glasses Blog - Expert Reviews, Guides & Industry Insights',
  description: 'Stay informed with our comprehensive AR glasses blog. Expert reviews, buying guides, technology analysis, and industry insights to help you navigate the world of augmented reality.',
  keywords: 'AR glasses blog, smart glasses reviews, AR technology guides, augmented reality insights, AR glasses news',
  openGraph: {
    title: 'AR Glasses Blog - Expert Reviews & Guides | AR Compare',
    description: 'Expert AR glasses content including reviews, buying guides, and technology insights. Your source for trusted augmented reality information.',
    url: 'https://ar-compare.com/blog',
    siteName: 'AR Compare',
    images: [
      {
        url: '/api/placeholder/1200/630',
        width: 1200,
        height: 630,
        alt: 'AR Compare Blog - Expert AR Glasses Content'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR Glasses Blog - Expert Reviews & Guides',
    description: 'Expert AR glasses content including reviews, buying guides, and technology insights.',
    images: ['/api/placeholder/1200/630'],
  },
  alternates: {
    canonical: 'https://ar-compare.com/blog',
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
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams;
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(10);

  return (
    <Suspense fallback={<SimpleLoading />}>
      <BlogListingClient 
        initialPosts={blogPosts}
        featuredPosts={featuredPosts}
        recentPosts={recentPosts}
        categories={blogCategories}
        searchParams={params}
      />
    </Suspense>
  );
}