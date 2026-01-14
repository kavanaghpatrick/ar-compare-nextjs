'use client';

import Link from 'next/link';
import { BlogPost } from '@/types';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useMemo } from 'react';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPost: BlogPost;
  limit?: number;
  title?: string;
}

interface PostSimilarity {
  post: BlogPost;
  score: number;
}

export function RelatedPosts({ 
  posts, 
  currentPost, 
  limit = 3,
  title = "Related Articles"
}: RelatedPostsProps) {
  
  const relatedPosts = useMemo(() => {
    // Filter out current post
    const otherPosts = posts.filter(post => post.id !== currentPost.id);
    
    // Calculate similarity scores
    const scoredPosts: PostSimilarity[] = otherPosts.map(post => {
      let score = 0;
      
      // Category match (highest weight)
      if (post.category === currentPost.category) {
        score += 20;
      }
      
      // Tag overlap
      const currentTags = currentPost.tags.map(tag => tag.toLowerCase());
      const postTags = post.tags.map(tag => tag.toLowerCase());
      const tagOverlap = currentTags.filter(tag => postTags.includes(tag)).length;
      score += tagOverlap * 10;
      
      // Title similarity (keyword matching)
      const currentTitleWords = currentPost.title.toLowerCase().split(' ').filter(word => word.length > 3);
      const postTitleWords = post.title.toLowerCase().split(' ').filter(word => word.length > 3);
      const titleOverlap = currentTitleWords.filter(word => postTitleWords.includes(word)).length;
      score += titleOverlap * 5;
      
      // Content similarity (basic keyword matching)
      const currentContentWords = currentPost.content.toLowerCase().split(' ').filter(word => word.length > 4);
      const postContentWords = post.content.toLowerCase().split(' ').filter(word => word.length > 4);
      const contentOverlap = new Set(currentContentWords.filter(word => postContentWords.includes(word))).size;
      score += Math.min(contentOverlap, 10) * 2; // Cap content similarity impact
      
      // Author match
      if (post.author.name === currentPost.author.name) {
        score += 5;
      }
      
      // Recency bonus (prefer newer content)
      const daysDiff = Math.abs(new Date(post.publishedAt).getTime() - new Date(currentPost.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 30) {
        score += 3;
      }
      
      // Featured content bonus
      if (post.featured) {
        score += 2;
      }
      
      return { post, score };
    });
    
    // Sort by score and return top posts
    return scoredPosts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }, [posts, currentPost, limit]);
  
  if (relatedPosts.length === 0) return null;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <section className="related-posts">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link 
          href="/blog"
          className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1 transition-colors"
        >
          View All Articles
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group cursor-pointer h-full">
              {/* Article Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mb-4 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                <BookOpen className="text-white/70 w-8 h-8" />
              </div>
              
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-3 text-white/60 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{post.readTime} min</span>
                  </div>
                </div>
              </div>
              
              {/* Article Title */}
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {/* Article Excerpt */}
              <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {post.author.name}
                  </p>
                </div>
              </div>
              
              {/* Tags Preview */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Hook for getting contextually related posts
export function useRelatedPosts(
  posts: BlogPost[], 
  currentPost: BlogPost, 
  options: {
    limit?: number;
    sameCategoryOnly?: boolean;
    sameAuthorBonus?: boolean;
    recencyWeight?: number;
  } = {}
): BlogPost[] {
  const {
    limit = 3,
    sameCategoryOnly = false,
    sameAuthorBonus = true,
    recencyWeight = 1
  } = options;
  
  return useMemo(() => {
    let filteredPosts = posts.filter(post => post.id !== currentPost.id);
    
    if (sameCategoryOnly) {
      filteredPosts = filteredPosts.filter(post => post.category === currentPost.category);
    }
    
    const scoredPosts = filteredPosts.map(post => {
      let score = 0;
      
      // Category match
      if (post.category === currentPost.category) {
        score += 15;
      }
      
      // Tag similarity
      const tagOverlap = post.tags.filter(tag => 
        currentPost.tags.includes(tag)
      ).length;
      score += tagOverlap * 8;
      
      // Author match
      if (sameAuthorBonus && post.author.name === currentPost.author.name) {
        score += 5;
      }
      
      // Recency
      const daysDiff = Math.abs(
        new Date(post.publishedAt).getTime() - new Date(currentPost.publishedAt).getTime()
      ) / (1000 * 60 * 60 * 24);
      score += Math.max(0, (30 - daysDiff) / 30 * 5 * recencyWeight);
      
      // Featured bonus
      if (post.featured) {
        score += 3;
      }
      
      return { post, score };
    });
    
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }, [posts, currentPost, limit, sameCategoryOnly, sameAuthorBonus, recencyWeight]);
}