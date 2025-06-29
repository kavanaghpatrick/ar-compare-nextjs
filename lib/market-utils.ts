import { Product } from '@/types';
import { marketAnalysis, ProductRanking, ProductRecommendation, MarketSegment, BuyerPersona } from '@/data/market-analysis';
import { arGlassesData } from '@/data/products';

// Market Analysis Utilities

/**
 * Get product by ID
 */
export function getProductById(productId: string): Product | undefined {
  return arGlassesData.find(product => product.id === productId);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return arGlassesData.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get products in price range
 */
export function getProductsByPriceRange(min: number, max: number): Product[] {
  return arGlassesData.filter(product => 
    product.price >= min && product.price <= max
  );
}

/**
 * Get product recommendations for a specific use case
 */
export function getUseCaseRecommendation(useCase: string): ProductRecommendation | undefined {
  return marketAnalysis.useCaseRecommendations[useCase]?.primaryRecommendation;
}

/**
 * Get market segment for a product
 */
export function getProductMarketSegment(productId: string): MarketSegment | undefined {
  return marketAnalysis.marketSegments.find(segment => 
    segment.products.includes(productId)
  );
}

/**
 * Get competitive ranking for a specific metric
 */
export function getCompetitiveRanking(metric: keyof typeof marketAnalysis.competitiveMatrix): ProductRanking[] {
  return marketAnalysis.competitiveMatrix[metric];
}

/**
 * Get product score for a specific competitive metric
 */
export function getProductScore(productId: string, metric: keyof typeof marketAnalysis.competitiveMatrix): number {
  const rankings = marketAnalysis.competitiveMatrix[metric];
  const ranking = rankings.find(r => r.productId === productId);
  return ranking?.score || 0;
}

/**
 * Get top N products for a specific metric
 */
export function getTopProducts(metric: keyof typeof marketAnalysis.competitiveMatrix, count: number = 3): ProductRanking[] {
  return marketAnalysis.competitiveMatrix[metric]
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * Get buyer persona recommendations
 */
export function getBuyerPersonaRecommendations(personaName: string): string[] {
  const persona = marketAnalysis.buyerPersonas.find(p => 
    p.name.toLowerCase() === personaName.toLowerCase()
  );
  return persona?.primaryRecommendations || [];
}

/**
 * Find best products for budget
 */
export function getBestProductsForBudget(budget: number, count: number = 3): Product[] {
  const suitableProducts = arGlassesData
    .filter(product => product.price <= budget)
    .sort((a, b) => {
      // Sort by value score (rating/price ratio) descending
      const aValue = a.rating / (a.price / 100);
      const bValue = b.rating / (b.price / 100);
      return bValue - aValue;
    });
  
  return suitableProducts.slice(0, count);
}

/**
 * Compare products across multiple metrics
 */
export interface ProductComparison {
  productId: string;
  scores: {
    displayQuality: number;
    valueForMoney: number;
    buildQuality: number;
    softwareEcosystem: number;
    innovation: number;
    userExperience: number;
  };
  averageScore: number;
  strengths: string[];
  weaknesses: string[];
}

export function compareProducts(productIds: string[]): ProductComparison[] {
  return productIds.map(productId => {
    const product = getProductById(productId);
    if (!product) return null;

    const scores = {
      displayQuality: getProductScore(productId, 'displayQuality'),
      valueForMoney: getProductScore(productId, 'valueForMoney'),
      buildQuality: getProductScore(productId, 'buildQuality'),
      softwareEcosystem: getProductScore(productId, 'softwareEcosystem'),
      innovation: getProductScore(productId, 'innovation'),
      userExperience: getProductScore(productId, 'userExperience')
    };

    const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 6;

    // Determine strengths (scores > 85) and weaknesses (scores < 70)
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(scores).forEach(([metric, score]) => {
      if (score > 85) {
        strengths.push(metric.replace(/([A-Z])/g, ' $1').toLowerCase());
      } else if (score < 70) {
        weaknesses.push(metric.replace(/([A-Z])/g, ' $1').toLowerCase());
      }
    });

    return {
      productId,
      scores,
      averageScore,
      strengths,
      weaknesses
    };
  }).filter(Boolean) as ProductComparison[];
}

/**
 * Get product alternatives
 */
export function getProductAlternatives(productId: string, count: number = 3): Product[] {
  const product = getProductById(productId);
  if (!product) return [];

  const priceRange = product.price * 0.3; // 30% price tolerance
  const minPrice = product.price - priceRange;
  const maxPrice = product.price + priceRange;

  return arGlassesData
    .filter(p => 
      p.id !== productId && 
      p.price >= minPrice && 
      p.price <= maxPrice
    )
    .sort((a, b) => {
      // Sort by similarity score (rating and price proximity)
      const aScore = a.rating - Math.abs(a.price - product.price) / 100;
      const bScore = b.rating - Math.abs(b.price - product.price) / 100;
      return bScore - aScore;
    })
    .slice(0, count);
}

/**
 * Get market trends affecting a product
 */
export function getProductTrends(productId: string) {
  return marketAnalysis.marketTrends.filter(trend => 
    trend.affectedProducts.includes(productId)
  );
}

/**
 * Calculate value score (price-performance ratio)
 */
export function calculateValueScore(productId: string): number {
  const valueRanking = marketAnalysis.competitiveMatrix.valueForMoney.find(
    r => r.productId === productId
  );
  return valueRanking?.score || 0;
}

/**
 * Get products suitable for a buyer persona
 */
export function getProductsForPersona(personaName: string): Product[] {
  const persona = marketAnalysis.buyerPersonas.find(p => 
    p.name.toLowerCase() === personaName.toLowerCase()
  );
  
  if (!persona) return [];

  return persona.primaryRecommendations
    .map(productId => getProductById(productId))
    .filter(Boolean) as Product[];
}

/**
 * Analyze market position of a product
 */
export interface MarketPosition {
  product: Product;
  segment: MarketSegment | undefined;
  competitiveStrengths: string[];
  marketOpportunities: string[];
  threats: string[];
  positioning: string;
}

export function analyzeMarketPosition(productId: string): MarketPosition | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;

  const segment = getProductMarketSegment(productId);
  const comparison = compareProducts([productId])[0];
  const trends = getProductTrends(productId);

  const competitiveStrengths = comparison.strengths.map(s => 
    s.charAt(0).toUpperCase() + s.slice(1)
  );

  const marketOpportunities = trends
    .filter(t => t.impact === 'high')
    .map(t => t.description);

  const threats = marketAnalysis.marketInsights.marketGaps
    .filter(gap => gap.toLowerCase().includes(product.category.toLowerCase()));

  let positioning = '';
  if (comparison.averageScore > 85) {
    positioning = 'Market Leader';
  } else if (comparison.averageScore > 75) {
    positioning = 'Strong Competitor';
  } else if (comparison.averageScore > 65) {
    positioning = 'Competitive Player';
  } else {
    positioning = 'Niche Player';
  }

  return {
    product,
    segment,
    competitiveStrengths,
    marketOpportunities,
    threats,
    positioning
  };
}

/**
 * Generate product recommendation based on requirements
 */
export interface UserRequirements {
  budget: number;
  primaryUseCase: string;
  technicalExpertise: 'beginner' | 'intermediate' | 'advanced';
  priorities: ('price' | 'display' | 'audio' | 'features' | 'build')[];
}

export function getPersonalizedRecommendation(requirements: UserRequirements): {
  primary: Product;
  alternatives: Product[];
  reasoning: string;
} | null {
  // Filter products by budget
  const budgetSuitableProducts = arGlassesData.filter(p => p.price <= requirements.budget);
  
  if (budgetSuitableProducts.length === 0) {
    return null;
  }

  // Get use case recommendation
  const useCaseRec = getUseCaseRecommendation(requirements.primaryUseCase);
  
  // Score products based on priorities
  const scoredProducts = budgetSuitableProducts.map(product => {
    let score = product.rating * 10; // Base score from rating
    
    // Apply priority weights
    requirements.priorities.forEach(priority => {
      switch (priority) {
        case 'price':
          score += getProductScore(product.id, 'valueForMoney') * 0.3;
          break;
        case 'display':
          score += getProductScore(product.id, 'displayQuality') * 0.3;
          break;
        case 'build':
          score += getProductScore(product.id, 'buildQuality') * 0.3;
          break;
        case 'features':
          score += getProductScore(product.id, 'softwareEcosystem') * 0.3;
          break;
      }
    });

    // Boost score if product matches use case recommendation
    if (useCaseRec && useCaseRec.primary === product.id) {
      score += 20;
    } else if (useCaseRec && useCaseRec.alternatives.includes(product.id)) {
      score += 10;
    }

    return { product, score };
  });

  // Sort by score and get top recommendations
  const sortedProducts = scoredProducts.sort((a, b) => b.score - a.score);
  
  const primary = sortedProducts[0].product;
  const alternatives = sortedProducts.slice(1, 3).map(p => p.product);

  const reasoning = `Based on your budget of $${requirements.budget} and focus on ${requirements.primaryUseCase}, ` +
    `the ${primary.name} offers the best combination of ${requirements.priorities.join(', ')} for your needs. ` +
    `${useCaseRec ? useCaseRec.reasoning : 'It provides good overall value and performance.'}`;

  return {
    primary,
    alternatives,
    reasoning
  };
}

export default {
  getProductById,
  getProductsByCategory,
  getProductsByPriceRange,
  getUseCaseRecommendation,
  getProductMarketSegment,
  getCompetitiveRanking,
  getProductScore,
  getTopProducts,
  getBuyerPersonaRecommendations,
  getBestProductsForBudget,
  compareProducts,
  getProductAlternatives,
  getProductTrends,
  calculateValueScore,
  getProductsForPersona,
  analyzeMarketPosition,
  getPersonalizedRecommendation
};