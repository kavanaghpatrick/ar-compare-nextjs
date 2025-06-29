'use client';

import Link from 'next/link';
import { Product, BlogPost } from '@/types';
import { useMemo } from 'react';

interface InternalLinkingSystemProps {
  content: string;
  products: Product[];
  currentPost?: BlogPost;
  currentProduct?: Product;
}

interface LinkMapping {
  keywords: string[];
  url: string;
  title: string;
  type: 'product' | 'category' | 'brand' | 'comparison';
  priority: number;
}

export function InternalLinkingSystem({ 
  content, 
  products, 
  currentPost, 
  currentProduct 
}: InternalLinkingSystemProps) {
  
  const linkMappings = useMemo(() => {
    const mappings: LinkMapping[] = [];
    
    // Product-specific links
    products.forEach(product => {
      // Skip if this is the current product
      if (currentProduct?.id === product.id) return;
      
      mappings.push({
        keywords: [
          product.fullName,
          `${product.brand} ${product.model}`,
          product.model
        ],
        url: `/products/${product.id}`,
        title: `${product.fullName} Review and Specs`,
        type: 'product',
        priority: 10
      });
    });
    
    // Brand category links
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(brand => {
      mappings.push({
        keywords: [
          `${brand} AR glasses`,
          `${brand} smart glasses`,
          `${brand} products`
        ],
        url: `/brand/${brand.toLowerCase()}`,
        title: `${brand} AR Glasses Comparison`,
        type: 'brand',
        priority: 5
      });
    });
    
    // Category links
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      mappings.push({
        keywords: [
          `${category.toLowerCase()} AR glasses`,
          `${category.toLowerCase()} smart glasses`,
          `best ${category.toLowerCase()} AR glasses`
        ],
        url: `/category/${category.toLowerCase()}`,
        title: `Best ${category} AR Glasses`,
        type: 'category',
        priority: 7
      });
    });
    
    // Comparison links for popular combinations
    const premiumProducts = products.filter(p => p.category === 'Premium');
    if (premiumProducts.length >= 2) {
      mappings.push({
        keywords: [
          'AR glasses comparison',
          'compare AR glasses',
          'best AR glasses comparison'
        ],
        url: `/compare?products=${premiumProducts.slice(0, 2).map(p => p.id).join(',')}`,
        title: 'Compare Premium AR Glasses',
        type: 'comparison',
        priority: 8
      });
    }
    
    return mappings;
  }, [products, currentProduct]);
  
  const processContentForLinks = (text: string): string => {
    let processedContent = text;
    const usedKeywords = new Set<string>();
    
    // Sort by priority (higher first) to ensure important links are processed first
    const sortedMappings = linkMappings.sort((a, b) => b.priority - a.priority);
    
    sortedMappings.forEach(mapping => {
      mapping.keywords.forEach(keyword => {
        // Skip if we've already linked this keyword
        if (usedKeywords.has(keyword.toLowerCase())) return;
        
        // Create case-insensitive regex that matches whole words
        const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        
        // Check if the keyword exists in the content
        if (regex.test(processedContent)) {
          // Replace only the first occurrence to avoid over-linking
          processedContent = processedContent.replace(regex, (match) => {
            usedKeywords.add(keyword.toLowerCase());
            return `<a href="${mapping.url}" class="internal-link text-blue-300 hover:text-blue-200 underline decoration-blue-300/50 hover:decoration-blue-200 transition-colors" title="${mapping.title}">${match}</a>`;
          });
        }
      });
    });
    
    return processedContent;
  };
  
  const processedContent = processContentForLinks(content);
  
  return (
    <div 
      className="internal-linking-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

// Hook for getting contextual product recommendations based on content
export function useContextualProducts(content: string, products: Product[], limit: number = 3): Product[] {
  return useMemo(() => {
    const contentLower = content.toLowerCase();
    const scoredProducts = products.map(product => {
      let score = 0;
      
      // Score based on brand mentions
      if (contentLower.includes(product.brand.toLowerCase())) {
        score += 10;
      }
      
      // Score based on model mentions
      if (contentLower.includes(product.model.toLowerCase())) {
        score += 15;
      }
      
      // Score based on category mentions
      if (contentLower.includes(product.category.toLowerCase())) {
        score += 5;
      }
      
      // Score based on key features mentions
      product.keyFeatures.forEach(feature => {
        if (contentLower.includes(feature.toLowerCase())) {
          score += 3;
        }
      });
      
      // Score based on price range mentions
      if (product.price < 300 && (contentLower.includes('budget') || contentLower.includes('affordable'))) {
        score += 8;
      }
      if (product.price > 500 && (contentLower.includes('premium') || contentLower.includes('high-end'))) {
        score += 8;
      }
      
      return { product, score };
    });
    
    return scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  }, [content, products, limit]);
}