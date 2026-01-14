/**
 * Tests for API Input Validation Schemas
 */

import {
  ProductFiltersSchema,
  CompareRequestSchema,
  PlaceholderParamsSchema,
  PlaceholderQuerySchema,
  MarketInsightsQuerySchema,
  parseSearchParams,
  createValidationErrorResponse,
} from '@/lib/api-validation';
import { z } from 'zod';

describe('ProductFiltersSchema', () => {
  it('should accept valid filters', () => {
    const result = ProductFiltersSchema.safeParse({
      category: 'ar-glasses',
      brand: 'Meta',
      minPrice: 100,
      maxPrice: 500,
      sortBy: 'price',
      sortOrder: 'desc',
      limit: 10,
      offset: 0,
    });
    expect(result.success).toBe(true);
  });

  it('should apply defaults for sortBy and sortOrder', () => {
    const result = ProductFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortBy).toBe('name');
      expect(result.data.sortOrder).toBe('asc');
    }
  });

  it('should reject invalid sortBy value', () => {
    const result = ProductFiltersSchema.safeParse({
      sortBy: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative prices', () => {
    const result = ProductFiltersSchema.safeParse({
      minPrice: -100,
    });
    expect(result.success).toBe(false);
  });

  it('should reject when maxPrice < minPrice', () => {
    const result = ProductFiltersSchema.safeParse({
      minPrice: 500,
      maxPrice: 100,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].path).toContain('maxPrice');
    }
  });

  it('should reject limit over 100', () => {
    const result = ProductFiltersSchema.safeParse({
      limit: 101,
    });
    expect(result.success).toBe(false);
  });

  it('should coerce string numbers to numbers', () => {
    const result = ProductFiltersSchema.safeParse({
      minPrice: '100',
      maxPrice: '500',
      limit: '10',
      offset: '5',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minPrice).toBe(100);
      expect(result.data.maxPrice).toBe(500);
      expect(result.data.limit).toBe(10);
      expect(result.data.offset).toBe(5);
    }
  });

  it('should reject category longer than 50 chars', () => {
    const result = ProductFiltersSchema.safeParse({
      category: 'a'.repeat(51),
    });
    expect(result.success).toBe(false);
  });
});

describe('CompareRequestSchema', () => {
  it('should accept valid product IDs array', () => {
    const result = CompareRequestSchema.safeParse({
      productIds: ['product-1', 'product-2', 'product-3'],
    });
    expect(result.success).toBe(true);
  });

  it('should reject less than 2 product IDs', () => {
    const result = CompareRequestSchema.safeParse({
      productIds: ['product-1'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('At least 2');
    }
  });

  it('should reject more than 5 product IDs', () => {
    const result = CompareRequestSchema.safeParse({
      productIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Maximum 5');
    }
  });

  it('should reject empty product ID strings', () => {
    const result = CompareRequestSchema.safeParse({
      productIds: ['product-1', ''],
    });
    expect(result.success).toBe(false);
  });

  it('should reject product IDs longer than 100 chars', () => {
    const result = CompareRequestSchema.safeParse({
      productIds: ['product-1', 'a'.repeat(101)],
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing productIds', () => {
    const result = CompareRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('PlaceholderParamsSchema', () => {
  it('should accept valid dimensions', () => {
    const result = PlaceholderParamsSchema.safeParse({
      width: 1200,
      height: 630,
    });
    expect(result.success).toBe(true);
  });

  it('should reject dimensions over 2000px', () => {
    const result = PlaceholderParamsSchema.safeParse({
      width: 2001,
      height: 630,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('2000');
    }
  });

  it('should reject zero or negative dimensions', () => {
    const resultZero = PlaceholderParamsSchema.safeParse({
      width: 0,
      height: 630,
    });
    expect(resultZero.success).toBe(false);

    const resultNegative = PlaceholderParamsSchema.safeParse({
      width: -100,
      height: 630,
    });
    expect(resultNegative.success).toBe(false);
  });

  it('should coerce string dimensions to numbers', () => {
    const result = PlaceholderParamsSchema.safeParse({
      width: '800',
      height: '600',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.width).toBe(800);
      expect(result.data.height).toBe(600);
    }
  });
});

describe('PlaceholderQuerySchema', () => {
  it('should accept valid hex colors', () => {
    const result = PlaceholderQuerySchema.safeParse({
      bg: '#0f172a',
      color: '#e2e8f0',
      accent: '#3b82f6',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid hex colors', () => {
    const result = PlaceholderQuerySchema.safeParse({
      bg: 'red',
    });
    expect(result.success).toBe(false);
  });

  it('should reject 3-char hex colors', () => {
    const result = PlaceholderQuerySchema.safeParse({
      bg: '#fff',
    });
    expect(result.success).toBe(false);
  });

  it('should accept valid title and subtitle', () => {
    const result = PlaceholderQuerySchema.safeParse({
      title: 'AR Compare',
      subtitle: 'Compare AR Glasses',
    });
    expect(result.success).toBe(true);
  });

  it('should reject title longer than 100 chars', () => {
    const result = PlaceholderQuerySchema.safeParse({
      title: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('should reject subtitle longer than 200 chars', () => {
    const result = PlaceholderQuerySchema.safeParse({
      subtitle: 'a'.repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe('MarketInsightsQuerySchema', () => {
  it('should accept valid insight types', () => {
    const types = ['overview', 'recommendations', 'competitive', 'trends'] as const;
    for (const type of types) {
      const result = MarketInsightsQuerySchema.safeParse({ type });
      expect(result.success).toBe(true);
    }
  });

  it('should default to overview', () => {
    const result = MarketInsightsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('overview');
    }
  });

  it('should reject invalid type', () => {
    const result = MarketInsightsQuerySchema.safeParse({
      type: 'invalid',
    });
    expect(result.success).toBe(false);
  });
});

describe('parseSearchParams', () => {
  it('should parse URLSearchParams correctly', () => {
    const params = new URLSearchParams();
    params.set('sortBy', 'price');
    params.set('sortOrder', 'desc');
    params.set('limit', '10');

    const result = parseSearchParams(params, ProductFiltersSchema);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortBy).toBe('price');
      expect(result.data.sortOrder).toBe('desc');
      expect(result.data.limit).toBe(10);
    }
  });

  it('should return error for invalid params', () => {
    const params = new URLSearchParams();
    params.set('sortBy', 'invalid');

    const result = parseSearchParams(params, ProductFiltersSchema);
    expect(result.success).toBe(false);
  });
});

describe('createValidationErrorResponse', () => {
  it('should format validation errors correctly', () => {
    const result = ProductFiltersSchema.safeParse({
      sortBy: 'invalid',
      minPrice: -100,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorResponse = createValidationErrorResponse(result.error);
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('VALIDATION_ERROR');
      expect(errorResponse.error.message).toBe('Invalid request parameters');
      expect(Array.isArray(errorResponse.error.details)).toBe(true);
      expect(errorResponse.error.details.length).toBeGreaterThan(0);
      expect(errorResponse.error.details[0]).toHaveProperty('field');
      expect(errorResponse.error.details[0]).toHaveProperty('message');
    }
  });
});
