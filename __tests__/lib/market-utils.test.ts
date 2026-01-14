/**
 * Tests for lib/market-utils.ts utility functions
 */

import {
  getProductById,
  getProductsByCategory,
  getProductsByPriceRange,
  getProductScore,
  getTopProducts,
  getBestProductsForBudget,
} from '@/lib/market-utils';

describe('getProductById', () => {
  it('should return product for valid ID', () => {
    const product = getProductById('xreal-one-pro');
    expect(product).toBeDefined();
    expect(product?.id).toBe('xreal-one-pro');
    expect(product?.brand).toBe('Xreal');
  });

  it('should return undefined for invalid ID', () => {
    const product = getProductById('non-existent-product');
    expect(product).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    const product = getProductById('');
    expect(product).toBeUndefined();
  });

  it('should be case-sensitive', () => {
    const product = getProductById('XREAL-ONE-PRO');
    expect(product).toBeUndefined();
  });
});

describe('getProductsByCategory', () => {
  it('should return products for valid category', () => {
    const products = getProductsByCategory('Premium');
    expect(products.length).toBeGreaterThan(0);
    products.forEach(product => {
      expect(product.category.toLowerCase()).toBe('premium');
    });
  });

  it('should be case-insensitive', () => {
    const upperCase = getProductsByCategory('PREMIUM');
    const lowerCase = getProductsByCategory('premium');
    const mixedCase = getProductsByCategory('Premium');

    expect(upperCase.length).toBe(lowerCase.length);
    expect(lowerCase.length).toBe(mixedCase.length);
  });

  it('should return empty array for non-existent category', () => {
    const products = getProductsByCategory('NonExistentCategory');
    expect(products).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    const products = getProductsByCategory('');
    expect(products).toEqual([]);
  });
});

describe('getProductsByPriceRange', () => {
  it('should return products within price range', () => {
    const products = getProductsByPriceRange(200, 500);
    expect(products.length).toBeGreaterThan(0);
    products.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(200);
      expect(product.price).toBeLessThanOrEqual(500);
    });
  });

  it('should include products at boundary prices', () => {
    // Get a product first to know its exact price
    const allProducts = getProductsByPriceRange(0, 10000);
    if (allProducts.length > 0) {
      const testProduct = allProducts[0];
      const exactMatch = getProductsByPriceRange(testProduct.price, testProduct.price);
      expect(exactMatch.some(p => p.id === testProduct.id)).toBe(true);
    }
  });

  it('should return empty array when no products in range', () => {
    const products = getProductsByPriceRange(0, 10);
    expect(products).toEqual([]);
  });

  it('should return empty array for reversed range (min > max)', () => {
    const products = getProductsByPriceRange(1000, 100);
    expect(products).toEqual([]);
  });

  it('should return all products for very wide range', () => {
    const products = getProductsByPriceRange(0, 100000);
    expect(products.length).toBeGreaterThan(0);
  });
});

describe('getProductScore', () => {
  it('should return score for valid product and metric', () => {
    const score = getProductScore('xreal-one-pro', 'displayQuality');
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should return 0 for non-existent product', () => {
    const score = getProductScore('non-existent', 'displayQuality');
    expect(score).toBe(0);
  });

  it('should work for different metrics', () => {
    const metrics = ['displayQuality', 'valueForMoney', 'buildQuality', 'softwareEcosystem', 'innovation', 'userExperience'] as const;

    metrics.forEach(metric => {
      const score = getProductScore('xreal-one-pro', metric);
      expect(typeof score).toBe('number');
    });
  });
});

describe('getTopProducts', () => {
  it('should return top 3 products by default', () => {
    const topProducts = getTopProducts('displayQuality');
    expect(topProducts.length).toBeLessThanOrEqual(3);
  });

  it('should return requested number of products', () => {
    const topProducts = getTopProducts('displayQuality', 5);
    expect(topProducts.length).toBeLessThanOrEqual(5);
  });

  it('should return products sorted by score descending', () => {
    const topProducts = getTopProducts('displayQuality', 5);
    for (let i = 1; i < topProducts.length; i++) {
      expect(topProducts[i - 1].score).toBeGreaterThanOrEqual(topProducts[i].score);
    }
  });

  it('should work for all metrics', () => {
    const metrics = ['displayQuality', 'valueForMoney', 'buildQuality'] as const;

    metrics.forEach(metric => {
      const topProducts = getTopProducts(metric);
      expect(Array.isArray(topProducts)).toBe(true);
    });
  });
});

describe('getBestProductsForBudget', () => {
  it('should return products under budget', () => {
    const budget = 500;
    const products = getBestProductsForBudget(budget);

    products.forEach(product => {
      expect(product.price).toBeLessThanOrEqual(budget);
    });
  });

  it('should return top 3 by default', () => {
    const products = getBestProductsForBudget(1000);
    expect(products.length).toBeLessThanOrEqual(3);
  });

  it('should return requested count', () => {
    const products = getBestProductsForBudget(1000, 5);
    expect(products.length).toBeLessThanOrEqual(5);
  });

  it('should return empty array for very low budget', () => {
    const products = getBestProductsForBudget(10);
    expect(products).toEqual([]);
  });

  it('should sort by value score (rating/price ratio)', () => {
    const products = getBestProductsForBudget(1000, 10);

    // Verify the first product has a better or equal value score than the second
    if (products.length >= 2) {
      const valueScore1 = products[0].rating / (products[0].price / 100);
      const valueScore2 = products[1].rating / (products[1].price / 100);
      expect(valueScore1).toBeGreaterThanOrEqual(valueScore2);
    }
  });
});
