'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  DollarSign, 
  Trophy, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Star,
  Calendar,
  Lightbulb,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { EnhancedProduct } from '@/types';

interface PurchaseRecommendationsProps {
  product: EnhancedProduct;
  allProducts: EnhancedProduct[];
  className?: string;
}

interface UserProfile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  matchScore: number;
  reasoning: string[];
}

interface BudgetAlternative {
  type: 'upgrade' | 'downgrade' | 'similar';
  product: EnhancedProduct;
  reasoning: string;
  savings?: number;
  additionalCost?: number;
}

export function PurchaseRecommendations({ 
  product, 
  allProducts, 
  className = "" 
}: PurchaseRecommendationsProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Generate user profiles based on product data
  const generateUserProfiles = (): UserProfile[] => {
    const profiles: UserProfile[] = [
      {
        id: 'professional',
        name: 'Professional User',
        description: 'Business use, productivity, presentations',
        icon: <Users size={20} />,
        matchScore: 0,
        reasoning: []
      },
      {
        id: 'gamer',
        name: 'Gaming Enthusiast',
        description: 'Gaming, entertainment, high performance',
        icon: <Target size={20} />,
        matchScore: 0,
        reasoning: []
      },
      {
        id: 'creator',
        name: 'Content Creator',
        description: 'Video creation, streaming, creative work',
        icon: <Trophy size={20} />,
        matchScore: 0,
        reasoning: []
      },
      {
        id: 'casual',
        name: 'Casual User',
        description: 'Entertainment, basic productivity, budget-conscious',
        icon: <Star size={20} />,
        matchScore: 0,
        reasoning: []
      },
      {
        id: 'developer',
        name: 'Developer/Enthusiast',
        description: 'Development, experimentation, cutting-edge tech',
        icon: <Lightbulb size={20} />,
        matchScore: 0,
        reasoning: []
      }
    ];

    // Calculate match scores based on product characteristics
    profiles.forEach(profile => {
      switch (profile.id) {
        case 'professional':
          if (product.category === 'Premium' || product.category === 'Professional') {
            profile.matchScore += 30;
            profile.reasoning.push('Premium build quality suitable for business use');
          }
          if (product.price > 500) {
            profile.matchScore += 20;
            profile.reasoning.push('Professional-grade pricing');
          }
          if (product.specifications.design.weight && parseInt(product.specifications.design.weight) < 80) {
            profile.matchScore += 25;
            profile.reasoning.push('Comfortable for extended professional use');
          }
          if (product.keyFeatures.some(f => f.toLowerCase().includes('productivity') || f.toLowerCase().includes('work'))) {
            profile.matchScore += 25;
            profile.reasoning.push('Features designed for productivity');
          }
          break;

        case 'gamer':
          if (parseInt(product.specifications.display.refreshRate) >= 90) {
            profile.matchScore += 30;
            profile.reasoning.push('High refresh rate for smooth gaming');
          }
          if (parseInt(product.specifications.display.fov) >= 50) {
            profile.matchScore += 25;
            profile.reasoning.push('Wide field of view for immersive gaming');
          }
          if (product.specifications.features?.latency && parseInt(product.specifications.features.latency) <= 10) {
            profile.matchScore += 25;
            profile.reasoning.push('Low latency for responsive gaming');
          }
          if (product.specifications.connectivity.compatibility.includes('Steam Deck')) {
            profile.matchScore += 20;
            profile.reasoning.push('Compatible with gaming devices');
          }
          break;

        case 'creator':
          if (product.specifications.display.brightness && parseInt(product.specifications.display.brightness) >= 600) {
            profile.matchScore += 25;
            profile.reasoning.push('High brightness for content creation');
          }
          if (product.specifications.display.colorAccuracy && !product.specifications.display.colorAccuracy.includes('monochrome')) {
            profile.matchScore += 30;
            profile.reasoning.push('Color accurate display for creative work');
          }
          if (product.specifications.features?.camera) {
            profile.matchScore += 20;
            profile.reasoning.push('Built-in camera for content capture');
          }
          if (product.keyFeatures.some(f => f.toLowerCase().includes('record') || f.toLowerCase().includes('stream'))) {
            profile.matchScore += 25;
            profile.reasoning.push('Features for content creation');
          }
          break;

        case 'casual':
          if (product.price <= 400) {
            profile.matchScore += 30;
            profile.reasoning.push('Budget-friendly pricing');
          }
          if (product.category === 'Budget' || product.category === 'Mid-range') {
            profile.matchScore += 25;
            profile.reasoning.push('Designed for mainstream users');
          }
          if (product.specifications.connectivity.compatibility.length >= 4) {
            profile.matchScore += 20;
            profile.reasoning.push('Works with many devices');
          }
          if (product.rating >= 4.0) {
            profile.matchScore += 25;
            profile.reasoning.push('Highly rated by users');
          }
          break;

        case 'developer':
          if (product.category === 'Developer' || product.brand === 'Brilliant Labs') {
            profile.matchScore += 40;
            profile.reasoning.push('Open-source or developer-focused platform');
          }
          if (product.specifications.features?.tracking && product.specifications.features.tracking.includes('6 DoF')) {
            profile.matchScore += 25;
            profile.reasoning.push('Advanced tracking capabilities');
          }
          if (product.keyFeatures.some(f => f.toLowerCase().includes('open') || f.toLowerCase().includes('sdk'))) {
            profile.matchScore += 30;
            profile.reasoning.push('Open platform for development');
          }
          if (product.specifications.features?.chip && product.specifications.features.chip.includes('custom')) {
            profile.matchScore += 15;
            profile.reasoning.push('Custom hardware for experimentation');
          }
          break;
      }

      // Cap match score at 100
      profile.matchScore = Math.min(profile.matchScore, 100);
    });

    return profiles.sort((a, b) => b.matchScore - a.matchScore);
  };

  // Generate budget alternatives
  const generateBudgetAlternatives = (): BudgetAlternative[] => {
    const alternatives: BudgetAlternative[] = [];
    const currentPrice = product.price;

    // Find downgrades (cheaper alternatives)
    const cheaperOptions = allProducts.filter(p => 
      p.id !== product.id && 
      p.price < currentPrice && 
      (p.category === product.category || Math.abs(p.price - currentPrice) <= 200)
    ).sort((a, b) => b.price - a.price);

    if (cheaperOptions.length > 0) {
      const bestCheaper = cheaperOptions[0];
      alternatives.push({
        type: 'downgrade',
        product: bestCheaper,
        reasoning: `Save $${currentPrice - bestCheaper.price} while maintaining core functionality`,
        savings: currentPrice - bestCheaper.price
      });
    }

    // Find upgrades (more expensive alternatives)
    const expensiveOptions = allProducts.filter(p => 
      p.id !== product.id && 
      p.price > currentPrice && 
      p.price <= currentPrice + 300 &&
      p.rating >= product.rating
    ).sort((a, b) => a.price - b.price);

    if (expensiveOptions.length > 0) {
      const bestUpgrade = expensiveOptions[0];
      alternatives.push({
        type: 'upgrade',
        product: bestUpgrade,
        reasoning: `Upgrade for $${bestUpgrade.price - currentPrice} more to get premium features`,
        additionalCost: bestUpgrade.price - currentPrice
      });
    }

    // Find similar priced alternatives
    const similarPriced = allProducts.filter(p => 
      p.id !== product.id && 
      Math.abs(p.price - currentPrice) <= 50 &&
      p.category !== product.category
    );

    if (similarPriced.length > 0) {
      const bestSimilar = similarPriced.sort((a, b) => b.rating - a.rating)[0];
      alternatives.push({
        type: 'similar',
        product: bestSimilar,
        reasoning: `Different approach at similar price point with ${bestSimilar.category.toLowerCase()} focus`
      });
    }

    return alternatives;
  };

  const userProfiles = generateUserProfiles();
  const budgetAlternatives = generateBudgetAlternatives();
  const topProfile = userProfiles[0];

  // Determine purchase timing advice
  const getPurchaseTimingAdvice = () => {
    const advice = [];
    
    if (product.availability === 'Pre-order') {
      advice.push({
        type: 'warning',
        icon: <Clock size={16} />,
        message: 'Pre-order item - consider waiting for reviews and availability'
      });
    }
    
    if (product.price < product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      advice.push({
        type: 'positive',
        icon: <TrendingUp size={16} />,
        message: `Currently ${discount}% off - good time to buy`
      });
    }
    
    if (product.releaseDate === '2024' || product.releaseDate === '2025') {
      advice.push({
        type: 'info',
        icon: <Calendar size={16} />,
        message: 'Recent release - cutting-edge technology'
      });
    }

    return advice;
  };

  const timingAdvice = getPurchaseTimingAdvice();

  return (
    <div className={`purchase-recommendations ${className}`}>
      <div className="recommendations-header">
        <h3 className="recommendations-title">
          <ShoppingCart size={24} />
          Purchase Recommendations
        </h3>
        <p className="recommendations-subtitle">
          Personalized buying advice based on your needs
        </p>
      </div>

      {/* Best For Section */}
      <div className="best-for-section">
        <h4>
          <Target size={20} />
          This Product is Best For
        </h4>
        <div className="best-for-grid">
          {product.purchaseRecommendation?.bestFor.map((recommendation, index) => (
            <div key={index} className="best-for-card">
              <CheckCircle size={16} className="text-green-400" />
              <span>{recommendation}</span>
            </div>
          ))}
        </div>
        
        {product.purchaseRecommendation?.avoidIf && product.purchaseRecommendation.avoidIf.length > 0 && (
          <div className="avoid-if-section">
            <h5>Avoid If</h5>
            <div className="avoid-if-grid">
              {product.purchaseRecommendation.avoidIf.map((reason, index) => (
                <div key={index} className="avoid-if-card">
                  <AlertCircle size={16} className="text-red-400" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Matching */}
      <div className="profile-matching-section">
        <h4>
          <Users size={20} />
          User Profile Match
        </h4>
        <div className="profiles-grid">
          {userProfiles.slice(0, 3).map((profile) => (
            <div 
              key={profile.id} 
              className={`profile-card ${selectedProfile === profile.id ? 'selected' : ''} ${profile.matchScore >= 70 ? 'high-match' : profile.matchScore >= 40 ? 'medium-match' : 'low-match'}`}
              onClick={() => setSelectedProfile(selectedProfile === profile.id ? null : profile.id)}
            >
              <div className="profile-header">
                <div className="profile-icon">{profile.icon}</div>
                <div className="profile-info">
                  <h5>{profile.name}</h5>
                  <p>{profile.description}</p>
                </div>
                <div className="match-score">
                  <div className="score-circle">
                    <span>{profile.matchScore}%</span>
                  </div>
                </div>
              </div>
              
              {selectedProfile === profile.id && profile.reasoning.length > 0 && (
                <div className="profile-reasoning">
                  <h6>Why this matches:</h6>
                  <ul>
                    {profile.reasoning.map((reason, index) => (
                      <li key={index}>
                        <ArrowRight size={12} />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget Alternatives */}
      {budgetAlternatives.length > 0 && (
        <div className="budget-alternatives-section">
          <h4>
            <DollarSign size={20} />
            Budget Alternatives
          </h4>
          <div className="alternatives-grid">
            {budgetAlternatives.map((alternative, index) => (
              <div key={index} className={`alternative-card ${alternative.type}`}>
                <div className="alternative-header">
                  <div className="alternative-type">
                    {alternative.type === 'upgrade' && <TrendingUp size={16} />}
                    {alternative.type === 'downgrade' && <DollarSign size={16} />}
                    {alternative.type === 'similar' && <Target size={16} />}
                    <span className="type-label">
                      {alternative.type === 'upgrade' ? 'Upgrade Option' : 
                       alternative.type === 'downgrade' ? 'Budget Option' : 
                       'Alternative'}
                    </span>
                  </div>
                  <div className="price-difference">
                    {alternative.savings && (
                      <span className="savings">Save ${alternative.savings}</span>
                    )}
                    {alternative.additionalCost && (
                      <span className="additional-cost">+${alternative.additionalCost}</span>
                    )}
                  </div>
                </div>
                
                <div className="alternative-product">
                  <h5>{alternative.product.name}</h5>
                  <div className="product-details">
                    <span className="price">${alternative.product.price}</span>
                    <div className="rating">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{alternative.product.rating}</span>
                    </div>
                  </div>
                  <p className="reasoning">{alternative.reasoning}</p>
                </div>
                
                <div className="alternative-specs">
                  <div className="spec-highlight">
                    <Eye size={12} />
                    <span>{alternative.product.specifications.display.fov}</span>
                  </div>
                  <div className="spec-highlight">
                    <Weight size={12} />
                    <span>{alternative.product.specifications.design.weight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Advantages */}
      <div className="competitive-advantages-section">
        <h4>
          <Trophy size={20} />
          Competitive Advantages
        </h4>
        <div className="advantages-content">
          {product.marketContext?.competitiveAdvantage && (
            <div className="main-advantage">
              <CheckCircle size={16} className="text-green-400" />
              <span>{product.marketContext.competitiveAdvantage}</span>
            </div>
          )}
          
          <div className="advantage-details">
            <div className="advantage-item">
              <strong>Market Position:</strong>
              <span>{product.marketContext?.pricePositioning || 'Competitive positioning'}</span>
            </div>
            
            <div className="advantage-item">
              <strong>Target Market:</strong>
              <span>{product.marketContext?.targetAudience || 'General consumers'}</span>
            </div>
            
            {product.marketContext?.useCases && (
              <div className="use-cases">
                <strong>Best Use Cases:</strong>
                <ul>
                  {product.marketContext.useCases.map((useCase, index) => (
                    <li key={index}>
                      <ArrowRight size={12} />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Timing Advice */}
      {timingAdvice.length > 0 && (
        <div className="timing-advice-section">
          <h4>
            <Clock size={20} />
            Purchase Timing Advice
          </h4>
          <div className="timing-advice-grid">
            {timingAdvice.map((advice, index) => (
              <div key={index} className={`timing-card ${advice.type}`}>
                {advice.icon}
                <span>{advice.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Consideration */}
      {product.purchaseRecommendation?.alternativeConsider && (
        <div className="alternative-consideration">
          <h4>Alternative to Consider</h4>
          <div className="consideration-card">
            <Lightbulb size={16} />
            <span>{product.purchaseRecommendation.alternativeConsider}</span>
          </div>
        </div>
      )}
    </div>
  );
}