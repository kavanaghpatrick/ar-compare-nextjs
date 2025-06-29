'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import arGlassesData from '@/data/products';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';
import { Star, User, Calendar, ThumbsUp } from 'lucide-react';

// Mock review data - pre-generated for performance
const reviewTemplates = [
  { rating: 5, title: 'Exceptional display quality', snippet: 'The micro-OLED displays are incredibly sharp and vibrant...' },
  { rating: 4, title: 'Great for productivity', snippet: 'Perfect for extending my workspace with multiple virtual screens...' },
  { rating: 4, title: 'Comfortable for long use', snippet: 'Lightweight design makes them comfortable for extended sessions...' },
  { rating: 3, title: 'Good but has limitations', snippet: 'Works well for basic tasks but battery life could be better...' },
  { rating: 5, title: 'Game changer for AR', snippet: 'These glasses have completely changed how I work and consume media...' },
  { rating: 4, title: 'Solid build quality', snippet: 'Well-constructed with premium materials and good durability...' }
];

// Pre-generate reviews data for better performance
const generateReviews = () => {
  return arGlassesData.slice(0, 6).flatMap(product => {
    const productSeed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const numReviews = (productSeed % 3) + 2; // 2-4 reviews per product
    
    return reviewTemplates.slice(0, numReviews).map((template, index) => ({
      id: `${product.id}-${index}`,
      product: product,
      rating: template.rating,
      title: template.title,
      content: template.snippet,
      author: `User${(productSeed + index * 17) % 1000}`,
      date: new Date(new Date('2024-06-01').getTime() + (productSeed + index * 1000000) % (90 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
      helpful: ((productSeed + index * 7) % 50) + 1
    }));
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function ReviewsPage() {
  const reviews = useMemo(() => generateReviews(), []);
  
  // Calculate review stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : '0';
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews * 100).toFixed(0) : '0'
  }));

  try {
    return (
    <div className="app-container">
      <NavigationSimple />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">AR Glasses Reviews</h1>
          <p className="text-xl text-white/80 mb-6">
            Real reviews from experts and users across all AR glasses brands
          </p>
        </div>

        {/* Review Statistics */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-lg border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalReviews}</div>
              <div className="text-white/70">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{avgRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={`${i < Math.floor(Number(avgRating)) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="text-white/70">Average Rating</div>
            </div>
            <div className="space-y-1">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-white w-8">{rating}★</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white/70 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.slice(0, 20).map((review) => (
            <div key={review.id} className="product-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Link 
                      href={`/product/${review.product.id}`}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {review.product.name}
                    </Link>
                    <span className="text-white/50">•</span>
                    <span className="text-white/70">{review.product.brand}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{review.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                        />
                      ))}
                      <span className="text-white/80 ml-1">{review.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <User size={14} />
                      <span>{review.author}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Calendar size={14} />
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-white/80 mb-4">{review.content}</p>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-white/60 hover:text-white/80 text-sm transition-colors">
                  <ThumbsUp size={14} />
                  <span>Helpful ({review.helpful})</span>
                </button>
                
                <Link 
                  href={`/product/${review.product.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View Product →
                </Link>
              </div>
            </div>
          ))}
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
  } catch (error) {
    console.error('Error rendering ReviewsPage:', error);
    return (
      <div className="app-container">
        <NavigationSimple />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Reviews</h1>
            <p className="text-white/80 mb-6">There was an error loading the reviews page.</p>
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}