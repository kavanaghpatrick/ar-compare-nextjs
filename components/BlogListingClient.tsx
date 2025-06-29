'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { BlogPost, BlogCategory } from '@/types';
import { Calendar, Clock, Search, Star, TrendingUp, BookOpen, Filter } from 'lucide-react';

interface BlogListingClientProps {
  initialPosts: BlogPost[];
  featuredPosts: BlogPost[];
  recentPosts: BlogPost[];
  categories: BlogCategory[];
  searchParams: { category?: string; search?: string };
}

export function BlogListingClient({
  initialPosts,
  featuredPosts,
  recentPosts,
  categories,
  searchParams
}: BlogListingClientProps) {
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all');

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    // Filter by search term
    if (searchTerm) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      posts = posts.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [initialPosts, searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'guides': return BookOpen;
      case 'reviews': return Star;
      case 'analysis': return TrendingUp;
      case 'privacy': return Filter;
      default: return BookOpen;
    }
  };

  return (
    <div className="app-container">
      <NavigationSimple />
      
      {/* Blog Hero Section */}
      <div className="blog-hero">
        <div className="blog-hero-container">
          <div className="trust-badges mb-6">
            <div className="trust-badge">
              <BookOpen className="trust-icon" />
              <span>Expert Content</span>
            </div>
            <div className="trust-badge">
              <Star className="trust-icon" />
              <span>In-Depth Reviews</span>
            </div>
            <div className="trust-badge">
              <TrendingUp className="trust-icon" />
              <span>Latest Insights</span>
            </div>
          </div>

          <h1 className="blog-hero-title">
            AR Glasses <span className="text-blue-400">Insights</span>
          </h1>
          
          <p className="blog-hero-subtitle">
            Expert reviews, comprehensive guides, and the latest insights in AR glasses technology. 
            Make informed decisions with our trusted analysis and hands-on testing.
          </p>

          {/* Search Bar */}
          <div className="blog-search-bar">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
              />
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <div className="scroll-text">More articles below</div>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-yellow-400" size={28} />
              <h2 className="text-3xl font-bold text-white">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="product-card group cursor-pointer h-full">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                      <span className="text-white/60 text-sm">Featured Image</span>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30 font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Clock size={14} />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/80 text-base leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{post.author.name}</p>
                        <p className="text-white/60 text-xs">{post.author.bio}</p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              All Articles ({initialPosts.length})
            </button>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon size={16} />
                  {category.name} ({category.postCount})
                </button>
              );
            })}
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Articles' : `${categories.find(c => c.slug === selectedCategory)?.name} Articles`}
              {searchTerm && (
                <span className="text-blue-400 font-normal"> - Search: "{searchTerm}"</span>
              )}
            </h2>
            <span className="text-white/60 text-sm">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="product-card group cursor-pointer h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-white/40 text-sm">Article Image</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Calendar size={12} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Clock size={12} />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 flex-grow">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/10">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white/80 text-sm">{post.author.name}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/60 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Show All Articles
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Get the latest AR glasses insights, reviews, and buying guides delivered to your inbox. 
              Join thousands of readers staying ahead in AR technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15"
              />
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to AR Glasses Comparison
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}