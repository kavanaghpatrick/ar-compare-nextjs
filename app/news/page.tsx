'use client';

import Link from 'next/link';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, TrendingUp, Users, Zap } from 'lucide-react';

// Mock news data - in a real app this would come from a CMS or news API
const newsArticles = [
  {
    id: 1,
    title: 'Apple Vision Pro Sparks New Wave of AR Innovation',
    excerpt: 'Following Apple\'s entrance into the AR space, competitors are accelerating development of next-generation AR glasses with improved displays and AI integration.',
    category: 'Industry',
    date: '2024-06-25',
    readTime: '5 min read',
    trending: true,
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Xreal Announces Partnership with Major Gaming Platform',
    excerpt: 'Xreal has announced a strategic partnership to bring cloud gaming directly to their AR glasses, promising console-quality gaming experiences.',
    category: 'Products',
    date: '2024-06-22',
    readTime: '3 min read',
    trending: true,
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Micro-OLED Displays: The Future of AR Glasses',
    excerpt: 'New micro-OLED technology promises 4K resolution per eye in AR glasses, with several manufacturers planning releases in 2024.',
    category: 'Technology',
    date: '2024-06-20',
    readTime: '7 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 4,
    title: 'AI-Powered AR Glasses Gain Traction in Enterprise',
    excerpt: 'Companies are increasingly adopting AI-enhanced AR glasses for training, remote assistance, and productivity applications.',
    category: 'Business',
    date: '2024-06-18',
    readTime: '4 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 5,
    title: 'Viture Pro 2 Leaked Specifications Surface Online',
    excerpt: 'Leaked documents suggest Viture\'s next-generation AR glasses will feature 120Hz displays and 8-hour battery life.',
    category: 'Rumors',
    date: '2024-06-15',
    readTime: '3 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 6,
    title: 'AR Glasses Market Expected to Reach $50B by 2030',
    excerpt: 'Industry analysts predict explosive growth in the AR glasses market, driven by improved technology and broader consumer adoption.',
    category: 'Market',
    date: '2024-06-12',
    readTime: '6 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 7,
    title: 'Rokid Max 2 Review: Improved Comfort and Display Quality',
    excerpt: 'Our hands-on review of Rokid\'s latest AR glasses reveals significant improvements in comfort and display technology.',
    category: 'Reviews',
    date: '2024-06-10',
    readTime: '8 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 8,
    title: 'Privacy Concerns Rise with AR Glasses Adoption',
    excerpt: 'As AR glasses become more mainstream, privacy advocates raise concerns about data collection and surveillance capabilities.',
    category: 'Privacy',
    date: '2024-06-08',
    readTime: '5 min read',
    trending: false,
    image: '/api/placeholder/400/250'
  }
];

const categories = [
  { name: 'All', icon: TrendingUp, count: newsArticles.length },
  { name: 'Industry', icon: Users, count: newsArticles.filter(a => a.category === 'Industry').length },
  { name: 'Products', icon: Zap, count: newsArticles.filter(a => a.category === 'Products').length },
  { name: 'Technology', icon: TrendingUp, count: newsArticles.filter(a => a.category === 'Technology').length },
  { name: 'Business', icon: Users, count: newsArticles.filter(a => a.category === 'Business').length },
];

export default function NewsPage() {
  const trendingArticles = newsArticles.filter(article => article.trending);
  const recentArticles = newsArticles.slice(0, 6);

  return (
    <div className="app-container">
      <NavigationSimple />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">AR Glasses News</h1>
          <p className="text-xl text-white/80 mb-6">
            Stay updated with the latest developments in AR glasses technology and industry trends
          </p>
        </div>

        {/* Trending Stories */}
        {trendingArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-orange-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Trending Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingArticles.map((article) => (
                <div key={article.id} className="product-card group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white/60">Featured Image</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Calendar size={14} />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="product-card text-center cursor-pointer group">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:text-blue-300 transition-colors" />
                  <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-white/60 text-sm">{category.count} articles</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Articles</h2>
          <div className="space-y-6">
            {recentArticles.map((article) => (
              <div key={article.id} className="product-card group cursor-pointer">
                <div className="flex gap-6">
                  <div className="w-32 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-white/40 text-xs">Image</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Clock size={14} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg border border-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-6">
            Get the latest AR glasses news and updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />
            <button className="btn btn-primary px-6">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="btn btn-outline"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}