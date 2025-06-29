import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BlogPostClient } from '@/components/BlogPostClient';
import { getPostBySlug, blogPosts, getRecentPosts } from '@/data/blog/posts';
import { SimpleLoading } from '@/components/SimpleLoading';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | AR Compare Blog',
      description: 'The requested blog post could not be found. Browse our latest AR glasses reviews and guides.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Ensure optimal title length (under 60 characters)
  const optimizedTitle = post.seo.metaTitle.length > 60 
    ? post.seo.metaTitle.substring(0, 57) + '...'
    : post.seo.metaTitle;

  // Ensure optimal description length (150-160 characters)
  const optimizedDescription = post.seo.metaDescription.length > 160
    ? post.seo.metaDescription.substring(0, 157) + '...'
    : post.seo.metaDescription;

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: post.seo.keywords.join(', '),
    authors: [{ name: post.author.name }],
    category: post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ar-compare.com/blog/${post.slug}`,
      siteName: 'AR Compare',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.length > 70 ? post.title.substring(0, 67) + '...' : post.title,
      description: post.excerpt.length > 200 ? post.excerpt.substring(0, 197) + '...' : post.excerpt,
      images: [post.image],
      creator: '@ARCompare',
      site: '@ARCompare',
    },
    alternates: {
      canonical: `https://ar-compare.com/blog/${post.slug}`,
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
      'article:author': post.author.name,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt || post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRecentPosts(3).filter(p => p.id !== post.id);

  return (
    <Suspense fallback={<SimpleLoading />}>
      <BlogPostClient 
        post={post}
        relatedPosts={relatedPosts}
      />
    </Suspense>
  );
}