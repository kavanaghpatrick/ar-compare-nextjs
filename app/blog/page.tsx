import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogListingClient } from '@/components/BlogListingClient';
import { blogPosts, getFeaturedPosts, getRecentPosts } from '@/data/blog/posts';
import { blogCategories } from '@/data/blog/categories';
import { SimpleLoading } from '@/components/SimpleLoading';

export const metadata: Metadata = {
  title: 'AR Glasses Blog 2024 - Best Smart Glasses Reviews & Guides',
  description: 'Discover the best AR glasses with expert reviews, buying guides & tech insights. Compare smart glasses features, prices & find your perfect AR solution.',
  keywords: 'AR glasses blog, smart glasses reviews 2024, AR technology guides, augmented reality insights, best AR glasses, AR glasses comparison, smart glasses buying guide',
  openGraph: {
    title: 'AR Glasses Blog 2024 - Expert Reviews & Buying Guides',
    description: 'Compare the best AR glasses with expert reviews, detailed buying guides, and cutting-edge technology insights. Your trusted source for smart glasses advice.',
    url: 'https://ar-compare.com/blog',
    siteName: 'AR Compare',
    images: [
      {
        url: '/api/placeholder/1200/630',
        width: 1200,
        height: 630,
        alt: 'AR Compare Blog - Expert Smart Glasses Reviews and Guides 2024'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR Glasses Blog 2024 - Expert Smart Glasses Reviews',
    description: 'Compare the best AR glasses with expert reviews & buying guides. Find your perfect smart glasses solution.',
    images: ['/api/placeholder/1200/630'],
    creator: '@ARCompare',
    site: '@ARCompare',
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
  other: {
    'article:publisher': 'https://www.facebook.com/ARCompare',
    'article:author': 'AR Compare Editorial Team',
    'article:section': 'Technology',
    'article:tag': 'AR glasses, smart glasses, augmented reality, technology reviews',
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