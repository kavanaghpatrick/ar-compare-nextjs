'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { BlogPost, BlogCategory } from '@/types';
import { Calendar, Clock, Search, Star, TrendingUp, BookOpen, Filter } from 'lucide-react';

interface BlogListingOptimizedProps {
  initialPosts: BlogPost[];
  featuredPosts: BlogPost[];
  recentPosts: BlogPost[];
  categories: BlogCategory[];
  searchParams: { category?: string; search?: string };
}

export function BlogListingOptimized({
  initialPosts,
  featuredPosts,
  recentPosts,
  categories,
  searchParams
}: BlogListingOptimizedProps) {
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

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category.toLowerCase()) {
      case 'guides': return BookOpen;
      case 'reviews': return Star;
      case 'analysis': return TrendingUp;
      case 'privacy': return Filter;
      default: return BookOpen;
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);

  return (
    <div className="app-container">
      <NavigationSimple />
      
      {/* Hero Section with structured data */}
      <header className="hero-enhanced" role="banner">
        <div className="hero-container">
          <div className="trust-badges mb-6" role="group" aria-label="Trust indicators">
            <div className="trust-badge">
              <BookOpen className="trust-icon" aria-hidden="true" />
              <span>Expert Content</span>
            </div>
            <div className="trust-badge">
              <Star className="trust-icon" aria-hidden="true" />
              <span>In-Depth Reviews</span>
            </div>
            <div className="trust-badge">
              <TrendingUp className="trust-icon" aria-hidden="true" />
              <span>Latest Insights</span>
            </div>
          </div>

          <h1 className="hero-title-enhanced">
            AR Glasses <span className="text-blue-400">Insights</span>
          </h1>
          
          <p className="hero-subtitle-enhanced">
            Expert reviews, comprehensive guides, and the latest insights in AR glasses technology. 
            Make informed decisions with our trusted analysis and hands-on testing.
          </p>

          {/* Enhanced Search Bar */}
          <div className="search-bar-enhanced">
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" 
                size={20} 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                aria-label="Search blog articles"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-yellow-400" size={28} aria-hidden="true" />
              <h2 id="featured-heading" className="text-3xl font-bold text-white">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="product-card group h-full">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                      {post.image && post.image !== '/api/placeholder/800/400' ? (
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={true}
                        />
                      ) : (
                        <span className="text-white/60 text-sm" aria-hidden="true">Featured Image</span>
                      )}
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
                        <Calendar size={14} aria-hidden="true" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Clock size={14} aria-hidden="true" />
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
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="mb-12" aria-labelledby="categories-heading">
          <h3 id="categories-heading" className="text-2xl font-bold text-white mb-6">Browse by Category</h3>
          <nav role="navigation" aria-label="Category filters">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                aria-pressed={selectedCategory === 'all'}
              >
                All Articles ({initialPosts.length})
              </button>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.slug
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    aria-pressed={selectedCategory === category.slug}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {category.name} ({category.postCount})
                  </button>
                );
              })}
            </div>
          </nav>
        </section>

        {/* Articles Grid */}
        <section aria-labelledby="articles-heading">
          <div className="flex items-center justify-between mb-8">
            <h2 id="articles-heading" className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Articles' : `${categories.find(c => c.slug === selectedCategory)?.name} Articles`}
              {searchTerm && (
                <span className="text-blue-400 font-normal"> - Search: "{searchTerm}"</span>
              )}
            </h2>
            <span className="text-white/60 text-sm" aria-live="polite">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article key={post.id} className="product-card group h-full flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {post.image && post.image !== '/api/placeholder/800/400' ? (
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading={index < 6 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <span className="text-white/40 text-sm" aria-hidden="true">Article Image</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Calendar size={12} aria-hidden="true" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Clock size={12} aria-hidden="true" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
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
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-white/30 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/60 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={resetFilters}
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
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
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
      </main>
      
      <Footer />
    </div>
  );
}