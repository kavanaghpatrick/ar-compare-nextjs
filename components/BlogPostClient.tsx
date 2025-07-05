'use client';

import Link from 'next/link';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { BlogPost } from '@/types';
import { Calendar, Clock, ArrowLeft, Share2, ChevronRight, BookOpen } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  // Convert markdown content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-white mb-3 mt-5">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="text-white/80 mb-2">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="text-white/80 mb-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-white/80 mb-4 leading-relaxed">')
      .replace(/^\n/, '<p class="text-white/80 mb-4 leading-relaxed">')
      + '</p>';
  };

  return (
    <div className="app-container">
      <NavigationSimple />
      
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} />
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <ChevronRight size={16} />
          <span className="text-white">{post.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 mb-12">
        <div className="mb-6">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <p className="text-white/60 text-sm">{post.author.bio}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image with explicit dimensions */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="relative rounded-xl overflow-hidden">
          <OptimizedImage
            src={post.image || '/api/placeholder/1200/675'}
            alt={post.title}
            width={1200}
            height={675}
            aspectRatio
            className="object-cover w-full"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 mb-16">
        <div className="prose prose-lg max-w-none">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-white font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full hover:bg-white/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Author Bio */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/10 p-8">
          <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-semibold">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">{post.author.name}</h4>
              <p className="text-white/80 leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                <article className="product-card group cursor-pointer h-full">
                  <div className="relative aspect-video rounded-lg mb-4 overflow-hidden">
                    <OptimizedImage
                      src={relatedPost.image || '/api/placeholder/400/225'}
                      alt={relatedPost.title}
                      width={400}
                      height={225}
                      aspectRatio
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      {relatedPost.category}
                    </span>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <Clock size={12} />
                      <span>{relatedPost.readTime} min</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {relatedPost.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <BookOpen size={20} />
            Compare AR Glasses
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}