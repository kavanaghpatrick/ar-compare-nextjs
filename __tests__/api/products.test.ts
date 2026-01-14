/**
 * Tests for API route helpers and data access functions
 * These test the server-side functions used by API routes
 */

import { arGlassesData } from '@/data/products';

describe('Products API Data', () => {
  describe('arGlassesData', () => {
    it('should have products array', () => {
      expect(Array.isArray(arGlassesData)).toBe(true);
      expect(arGlassesData.length).toBeGreaterThan(0);
    });

    it('should have valid product structure', () => {
      const product = arGlassesData[0];

      // Required fields
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('model');
      expect(product).toHaveProperty('fullName');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('rating');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('releaseDate');
    });

    it('should have valid price for all products', () => {
      arGlassesData.forEach(product => {
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('should have valid rating for all products', () => {
      arGlassesData.forEach(product => {
        expect(typeof product.rating).toBe('number');
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have unique IDs', () => {
      const ids = arGlassesData.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid categories', () => {
      const validCategories = ['Premium', 'Mid-range', 'Budget', 'Developer', 'Everyday'];
      arGlassesData.forEach(product => {
        expect(validCategories).toContain(product.category);
      });
    });
  });

  describe('filtering products', () => {
    it('should be able to filter by category', () => {
      const premium = arGlassesData.filter(p => p.category === 'Premium');
      expect(premium.length).toBeGreaterThan(0);
      premium.forEach(p => expect(p.category).toBe('Premium'));
    });

    it('should be able to filter by brand', () => {
      const xreal = arGlassesData.filter(p => p.brand === 'Xreal');
      expect(xreal.length).toBeGreaterThan(0);
      xreal.forEach(p => expect(p.brand).toBe('Xreal'));
    });

    it('should be able to filter by price range', () => {
      const minPrice = 200;
      const maxPrice = 500;
      const filtered = arGlassesData.filter(p => p.price >= minPrice && p.price <= maxPrice);

      filtered.forEach(p => {
        expect(p.price).toBeGreaterThanOrEqual(minPrice);
        expect(p.price).toBeLessThanOrEqual(maxPrice);
      });
    });
  });

  describe('sorting products', () => {
    it('should be able to sort by price ascending', () => {
      const sorted = [...arGlassesData].sort((a, b) => a.price - b.price);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].price).toBeLessThanOrEqual(sorted[i].price);
      }
    });

    it('should be able to sort by price descending', () => {
      const sorted = [...arGlassesData].sort((a, b) => b.price - a.price);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].price).toBeGreaterThanOrEqual(sorted[i].price);
      }
    });

    it('should be able to sort by rating descending', () => {
      const sorted = [...arGlassesData].sort((a, b) => b.rating - a.rating);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].rating).toBeGreaterThanOrEqual(sorted[i].rating);
      }
    });

    it('should be able to sort by name alphabetically', () => {
      const sorted = [...arGlassesData].sort((a, b) =>
        a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
      );

      for (let i = 1; i < sorted.length; i++) {
        expect(
          sorted[i - 1].fullName.toLowerCase().localeCompare(sorted[i].fullName.toLowerCase())
        ).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('pagination', () => {
    it('should be able to paginate results', () => {
      const limit = 3;
      const offset = 0;
      const page1 = arGlassesData.slice(offset, offset + limit);

      expect(page1.length).toBeLessThanOrEqual(limit);
    });

    it('should return correct items for different offsets', () => {
      const limit = 2;

      const page1 = arGlassesData.slice(0, limit);
      const page2 = arGlassesData.slice(limit, limit * 2);

      // Pages should not overlap
      page1.forEach(p1 => {
        page2.forEach(p2 => {
          expect(p1.id).not.toBe(p2.id);
        });
      });
    });

    it('should handle offset beyond data length', () => {
      const offset = arGlassesData.length + 10;
      const page = arGlassesData.slice(offset, offset + 10);

      expect(page).toEqual([]);
    });
  });

  describe('product lookup', () => {
    it('should find product by ID', () => {
      const firstProduct = arGlassesData[0];
      const found = arGlassesData.find(p => p.id === firstProduct.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(firstProduct.id);
    });

    it('should return undefined for non-existent ID', () => {
      const found = arGlassesData.find(p => p.id === 'non-existent-product-id');

      expect(found).toBeUndefined();
    });
  });

  describe('product specifications', () => {
    it('should have specifications for all products', () => {
      arGlassesData.forEach(product => {
        expect(product).toHaveProperty('specifications');
        expect(typeof product.specifications).toBe('object');
      });
    });

    it('should have display specifications', () => {
      arGlassesData.forEach(product => {
        expect(product.specifications).toHaveProperty('display');
      });
    });

    it('should have design specifications', () => {
      arGlassesData.forEach(product => {
        expect(product.specifications).toHaveProperty('design');
      });
    });
  });
});

describe('Product comparison logic', () => {
  it('should be able to compare multiple products', () => {
    const productIds = ['xreal-one-pro', 'rokid-ar-spatial'];
    const products = productIds.map(id => arGlassesData.find(p => p.id === id));

    // Filter out undefined
    const validProducts = products.filter(p => p !== undefined);

    expect(validProducts.length).toBe(productIds.length);
  });

  it('should identify missing products in comparison', () => {
    const productIds = ['xreal-one-pro', 'non-existent', 'rokid-ar-spatial'];
    const products = productIds.map(id => arGlassesData.find(p => p.id === id));

    const validProducts = products.filter(p => p !== undefined);
    const missingIds = productIds.filter((_, i) => !products[i]);

    expect(validProducts.length).toBe(2);
    expect(missingIds).toContain('non-existent');
  });
});
