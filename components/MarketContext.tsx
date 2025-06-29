'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Building2, 
  DollarSign, 
  Users, 
  BarChart3, 
  Target, 
  Award, 
  Globe,
  Zap,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Star,
  Shield
} from 'lucide-react';
import { EnhancedProduct } from '@/types';

interface MarketContextProps {
  product: EnhancedProduct;
  allProducts: EnhancedProduct[];
  className?: string;
}

interface MarketSegment {
  name: string;
  priceRange: [number, number];
  products: EnhancedProduct[];
  marketShare: number;
  characteristics: string[];
}

interface CompetitorAnalysis {
  brand: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  priceRange: [number, number];
  productCount: number;
}

interface TrendData {
  trend: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  relevance: number;
}

export function MarketContext({ 
  product, 
  allProducts, 
  className = "" 
}: MarketContextProps) {
  const [activeTab, setActiveTab] = useState<'positioning' | 'competition' | 'trends' | 'reputation'>('positioning');

  // Calculate market segments
  const marketSegments = useMemo((): MarketSegment[] => {
    const segments: MarketSegment[] = [
      {
        name: 'Budget',
        priceRange: [0, 400],
        products: [],
        marketShare: 0,
        characteristics: ['Entry-level', 'Basic features', 'Mass market appeal']
      },
      {
        name: 'Mid-range',
        priceRange: [400, 700],
        products: [],
        marketShare: 0,
        characteristics: ['Balanced features', 'Good value', 'Mainstream adoption']
      },
      {
        name: 'Premium',
        priceRange: [700, 1200],
        products: [],
        marketShare: 0,
        characteristics: ['High-end features', 'Professional quality', 'Early adopters']
      },
      {
        name: 'Ultra-premium',
        priceRange: [1200, 2000],
        products: [],
        marketShare: 0,
        characteristics: ['Cutting-edge tech', 'Enterprise focus', 'Technology leaders']
      }
    ];

    // Categorize products into segments
    allProducts.forEach(p => {
      const segment = segments.find(s => p.price >= s.priceRange[0] && p.price < s.priceRange[1]);
      if (segment) {
        segment.products.push(p);
      }
    });

    // Calculate market share based on product count (simplified)
    const totalProducts = allProducts.length;
    segments.forEach(segment => {
      segment.marketShare = (segment.products.length / totalProducts) * 100;
    });

    return segments.filter(s => s.products.length > 0);
  }, [allProducts]);

  // Competitor analysis
  const competitorAnalysis = useMemo((): CompetitorAnalysis[] => {
    const brandMap = new Map<string, EnhancedProduct[]>();
    
    allProducts.forEach(p => {
      if (!brandMap.has(p.brand)) {
        brandMap.set(p.brand, []);
      }
      brandMap.get(p.brand)!.push(p);
    });

    const competitors: CompetitorAnalysis[] = [];
    
    brandMap.forEach((products, brand) => {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      // Extract market share from company info (if available)
      const marketShare = products[0].companyInfo?.marketShare || '0%';
      
      // Analyze brand strengths and weaknesses based on product data
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      // Analyze based on product characteristics
      const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      
      if (avgRating >= 4.5) strengths.push('High customer satisfaction');
      if (avgRating < 4.0) weaknesses.push('Mixed customer reviews');
      
      if (products.length >= 3) strengths.push('Diverse product portfolio');
      if (products.length === 1) weaknesses.push('Limited product range');
      
      if (avgPrice <= 400) strengths.push('Budget-friendly options');
      if (avgPrice >= 800) strengths.push('Premium positioning');
      
      // Brand-specific analysis
      switch (brand) {
        case 'Xreal':
          strengths.push('Market leader', 'Proven technology', 'Wide compatibility');
          break;
        case 'Rokid':
          strengths.push('AI integration', 'Spatial computing');
          if (products.some(p => p.specifications.features?.latency && parseInt(p.specifications.features.latency) > 15)) {
            weaknesses.push('Higher latency');
          }
          break;
        case 'Viture':
          strengths.push('Excellent value', 'High brightness displays');
          weaknesses.push('Smaller ecosystem');
          break;
        case 'RayNeo':
          strengths.push('Innovative features', 'TCL backing');
          if (products.some(p => p.category === 'Budget')) {
            strengths.push('Budget options available');
          }
          break;
        case 'Even Realities':
          strengths.push('Elegant design', 'Prescription support');
          weaknesses.push('Limited features', 'Monochrome display');
          break;
        case 'Brilliant Labs':
          strengths.push('Open source', 'Developer friendly');
          weaknesses.push('Not consumer ready', 'Rough experience');
          break;
      }
      
      competitors.push({
        brand,
        marketShare,
        strengths,
        weaknesses,
        priceRange: [minPrice, maxPrice],
        productCount: products.length
      });
    });

    return competitors.sort((a, b) => parseFloat(b.marketShare) - parseFloat(a.marketShare));
  }, [allProducts]);

  // Industry trends analysis
  const industryTrends = useMemo((): TrendData[] => {
    const trends: TrendData[] = [
      {
        trend: 'Micro-OLED Display Adoption',
        impact: 'positive',
        description: 'Higher resolution, better color accuracy, and lower power consumption',
        relevance: product.specifications.display.type.toLowerCase().includes('micro-oled') ? 90 : 60
      },
      {
        trend: 'Spatial Computing Integration',
        impact: 'positive',
        description: 'AI-powered spatial awareness and real-world interaction',
        relevance: product.specifications.features?.tracking?.includes('6 DoF') || 
                  product.keyFeatures.some(f => f.toLowerCase().includes('spatial')) ? 85 : 40
      },
      {
        trend: 'Mainstream Price Reduction',
        impact: 'positive',
        description: 'AR glasses becoming more affordable for mass market adoption',
        relevance: product.price <= 500 ? 80 : 60
      },
      {
        trend: 'Battery Life Concerns',
        impact: 'negative',
        description: 'Limited battery life remains a significant adoption barrier',
        relevance: product.category === 'Developer' || product.specifications.features?.chip?.includes('advanced') ? 70 : 50
      },
      {
        trend: 'Enterprise Adoption',
        impact: 'positive',
        description: 'Growing business use cases for AR glasses in various industries',
        relevance: product.category === 'Professional' || product.category === 'Premium' ? 85 : 40
      },
      {
        trend: 'Prescription Integration',
        impact: 'positive',
        description: 'Better accommodation for vision correction needs',
        relevance: product.specifications.design.ipdAdjustment !== 'Fixed' ? 75 : 30
      }
    ];

    return trends.sort((a, b) => b.relevance - a.relevance);
  }, [product]);

  // Get current product's market segment
  const currentSegment = marketSegments.find(s => 
    product.price >= s.priceRange[0] && product.price < s.priceRange[1]
  );

  // Get competitor for current brand
  const currentBrandAnalysis = competitorAnalysis.find(c => c.brand === product.brand);

  return (
    <div className={`market-context ${className}`}>
      <div className="market-context-header">
        <h3 className="market-context-title">
          <BarChart3 size={24} />
          Market Context & Analysis
        </h3>
        <p className="market-context-subtitle">
          Understanding {product.name} in the AR glasses market
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="market-tabs">
        <button
          onClick={() => setActiveTab('positioning')}
          className={`tab-btn ${activeTab === 'positioning' ? 'active' : ''}`}
        >
          <Target size={16} />
          Positioning
        </button>
        <button
          onClick={() => setActiveTab('competition')}
          className={`tab-btn ${activeTab === 'competition' ? 'active' : ''}`}
        >
          <Building2 size={16} />
          Competition
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
        >
          <TrendingUp size={16} />
          Trends
        </button>
        <button
          onClick={() => setActiveTab('reputation')}
          className={`tab-btn ${activeTab === 'reputation' ? 'active' : ''}`}
        >
          <Award size={16} />
          Reputation
        </button>
      </div>

      {/* Market Positioning Tab */}
      {activeTab === 'positioning' && (
        <div className="positioning-content">
          {/* Market Segments Overview */}
          <div className="segments-section">
            <h4>
              <Target size={20} />
              Market Segments
            </h4>
            <div className="segments-grid">
              {marketSegments.map((segment) => (
                <div 
                  key={segment.name} 
                  className={`segment-card ${currentSegment?.name === segment.name ? 'current-segment' : ''}`}
                >
                  <div className="segment-header">
                    <h5>{segment.name}</h5>
                    <div className="price-range">
                      ${segment.priceRange[0]} - ${segment.priceRange[1]}
                    </div>
                  </div>
                  
                  <div className="segment-stats">
                    <div className="market-share">
                      <span className="share-label">Market Share:</span>
                      <span className="share-value">{segment.marketShare.toFixed(1)}%</span>
                    </div>
                    <div className="product-count">
                      <span>{segment.products.length} products</span>
                    </div>
                  </div>
                  
                  <div className="characteristics">
                    {segment.characteristics.map((char, index) => (
                      <span key={index} className="characteristic-tag">{char}</span>
                    ))}
                  </div>
                  
                  {currentSegment?.name === segment.name && (
                    <div className="current-product-indicator">
                      <Star size={14} />
                      <span>Current Product</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Positioning */}
          <div className="price-positioning-section">
            <h4>
              <DollarSign size={20} />
              Price Positioning
            </h4>
            <div className="price-analysis">
              <div className="price-context">
                <div className="current-price">
                  <span className="label">Current Price:</span>
                  <span className="value">${product.price}</span>
                </div>
                
                {currentSegment && (
                  <div className="segment-position">
                    <span className="label">Segment Position:</span>
                    <span className="value">
                      {currentSegment.name} 
                      ({Math.round(((product.price - currentSegment.priceRange[0]) / 
                        (currentSegment.priceRange[1] - currentSegment.priceRange[0])) * 100)}% of range)
                    </span>
                  </div>
                )}
                
                {product.marketContext?.pricePositioning && (
                  <div className="positioning-description">
                    <Info size={16} />
                    <span>{product.marketContext.pricePositioning}</span>
                  </div>
                )}
              </div>
              
              <div className="price-comparison">
                <div className="comparison-stats">
                  <div className="stat-item">
                    <ArrowDown size={16} className="text-green-400" />
                    <span>Cheaper than {allProducts.filter(p => p.price > product.price).length} products</span>
                  </div>
                  <div className="stat-item">
                    <ArrowUp size={16} className="text-red-400" />
                    <span>More expensive than {allProducts.filter(p => p.price < product.price).length} products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="target-audience-section">
            <h4>
              <Users size={20} />
              Target Audience
            </h4>
            <div className="audience-analysis">
              {product.marketContext?.targetAudience && (
                <div className="primary-audience">
                  <h5>Primary Target:</h5>
                  <p>{product.marketContext.targetAudience}</p>
                </div>
              )}
              
              {product.marketContext?.useCases && (
                <div className="use-cases">
                  <h5>Key Use Cases:</h5>
                  <ul>
                    {product.marketContext.useCases.map((useCase, index) => (
                      <li key={index}>
                        <Zap size={12} />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Competition Tab */}
      {activeTab === 'competition' && (
        <div className="competition-content">
          <div className="competitive-landscape">
            <h4>
              <Building2 size={20} />
              Competitive Landscape
            </h4>
            <div className="competitors-grid">
              {competitorAnalysis.map((competitor) => (
                <div 
                  key={competitor.brand} 
                  className={`competitor-card ${competitor.brand === product.brand ? 'current-brand' : ''}`}
                >
                  <div className="competitor-header">
                    <h5>{competitor.brand}</h5>
                    <div className="market-share-badge">
                      {competitor.marketShare} market share
                    </div>
                  </div>
                  
                  <div className="competitor-stats">
                    <div className="stat">
                      <span className="label">Products:</span>
                      <span className="value">{competitor.productCount}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Price Range:</span>
                      <span className="value">
                        ${competitor.priceRange[0]} - ${competitor.priceRange[1]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="competitor-analysis">
                    <div className="strengths">
                      <h6>Strengths:</h6>
                      <ul>
                        {competitor.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index}>
                            <Shield size={12} className="text-green-400" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {competitor.weaknesses.length > 0 && (
                      <div className="weaknesses">
                        <h6>Challenges:</h6>
                        <ul>
                          {competitor.weaknesses.slice(0, 2).map((weakness, index) => (
                            <li key={index}>
                              <Info size={12} className="text-yellow-400" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {competitor.brand === product.brand && (
                    <div className="current-brand-indicator">
                      <Star size={14} />
                      <span>Current Brand</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Advantage */}
          {product.marketContext?.competitiveAdvantage && (
            <div className="competitive-advantage">
              <h4>
                <Award size={20} />
                Competitive Advantage
              </h4>
              <div className="advantage-card">
                <p>{product.marketContext.competitiveAdvantage}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Industry Trends Tab */}
      {activeTab === 'trends' && (
        <div className="trends-content">
          <h4>
            <TrendingUp size={20} />
            Industry Trends
          </h4>
          <div className="trends-grid">
            {industryTrends.map((trend) => (
              <div key={trend.trend} className={`trend-card ${trend.impact}`}>
                <div className="trend-header">
                  <h5>{trend.trend}</h5>
                  <div className="trend-impact">
                    {trend.impact === 'positive' && <ArrowUp size={16} className="text-green-400" />}
                    {trend.impact === 'negative' && <ArrowDown size={16} className="text-red-400" />}
                    {trend.impact === 'neutral' && <Minus size={16} className="text-yellow-400" />}
                  </div>
                </div>
                
                <p className="trend-description">{trend.description}</p>
                
                <div className="relevance-bar">
                  <div className="relevance-label">Relevance to this product:</div>
                  <div className="relevance-score">
                    <div 
                      className="relevance-fill" 
                      style={{ width: `${trend.relevance}%` }}
                    ></div>
                    <span className="relevance-text">{trend.relevance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Reputation Tab */}
      {activeTab === 'reputation' && (
        <div className="reputation-content">
          <h4>
            <Award size={20} />
            Brand Reputation & Insights
          </h4>
          
          {product.companyInfo && (
            <div className="company-info">
              <div className="company-stats">
                <div className="stat-card">
                  <Calendar size={16} />
                  <div>
                    <span className="label">Founded</span>
                    <span className="value">{product.companyInfo.founded}</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Globe size={16} />
                  <div>
                    <span className="label">Headquarters</span>
                    <span className="value">{product.companyInfo.headquarters}</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Users size={16} />
                  <div>
                    <span className="label">Employees</span>
                    <span className="value">{product.companyInfo.employees}</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <BarChart3 size={16} />
                  <div>
                    <span className="label">Market Share</span>
                    <span className="value">{product.companyInfo.marketShare}</span>
                  </div>
                </div>
              </div>
              
              <div className="company-description">
                <p>{product.companyInfo.description}</p>
              </div>
            </div>
          )}
          
          {/* Customer Insights */}
          {product.customerInsights && (
            <div className="customer-insights">
              <h5>Customer Sentiment</h5>
              <div className="sentiment-overview">
                <div className="overall-sentiment">
                  <strong>Overall:</strong> {product.customerInsights.overallSentiment}
                </div>
                
                <div className="sentiment-breakdown">
                  <div className="pros-insights">
                    <h6>Top Customer Praise:</h6>
                    <ul>
                      {product.customerInsights.topPros.slice(0, 3).map((pro, index) => (
                        <li key={index}>
                          <ArrowUp size={12} className="text-green-400" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="cons-insights">
                    <h6>Common Concerns:</h6>
                    <ul>
                      {product.customerInsights.topCons.slice(0, 3).map((con, index) => (
                        <li key={index}>
                          <ArrowDown size={12} className="text-red-400" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}