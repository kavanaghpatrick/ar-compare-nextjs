/**
 * API Input Validation Schemas using Zod
 *
 * This module provides type-safe validation for all API endpoints
 * to prevent security vulnerabilities and ensure data integrity.
 */

import { z } from 'zod';

// ============================================
// Products API Validation
// ============================================

/**
 * Schema for GET /api/products query parameters
 */
export const ProductFiltersSchema = z.object({
  category: z.string().max(50).optional(),
  brand: z.string().max(50).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'releaseDate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  limit: z.coerce.number().positive().max(100).optional(),
  offset: z.coerce.number().nonnegative().optional(),
}).refine(
  (data) => {
    // Ensure maxPrice >= minPrice if both are provided
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'maxPrice must be greater than or equal to minPrice',
    path: ['maxPrice'],
  }
);

export type ProductFilters = z.infer<typeof ProductFiltersSchema>;

/**
 * Schema for POST /api/products/compare request body
 */
export const CompareRequestSchema = z.object({
  productIds: z
    .array(z.string().min(1).max(100))
    .min(2, 'At least 2 product IDs are required for comparison')
    .max(5, 'Maximum 5 products can be compared at once'),
});

export type CompareRequest = z.infer<typeof CompareRequestSchema>;

// ============================================
// Placeholder Image API Validation
// ============================================

/**
 * Maximum dimensions for placeholder images to prevent DoS attacks
 */
const MAX_IMAGE_DIMENSION = 2000;

/**
 * Schema for GET /api/placeholder/[width]/[height] parameters
 */
export const PlaceholderParamsSchema = z.object({
  width: z.coerce
    .number()
    .positive('Width must be positive')
    .max(MAX_IMAGE_DIMENSION, `Width cannot exceed ${MAX_IMAGE_DIMENSION}px`),
  height: z.coerce
    .number()
    .positive('Height must be positive')
    .max(MAX_IMAGE_DIMENSION, `Height cannot exceed ${MAX_IMAGE_DIMENSION}px`),
});

export type PlaceholderParams = z.infer<typeof PlaceholderParamsSchema>;

/**
 * Schema for placeholder query parameters
 */
export const PlaceholderQuerySchema = z.object({
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export type PlaceholderQuery = z.infer<typeof PlaceholderQuerySchema>;

// ============================================
// Market Insights API Validation
// ============================================

/**
 * Schema for GET /api/market/insights query parameters
 */
export const MarketInsightsQuerySchema = z.object({
  type: z.enum(['overview', 'recommendations', 'competitive', 'trends']).default('overview'),
  category: z.string().max(50).optional(),
  productId: z.string().max(100).optional(),
});

export type MarketInsightsQuery = z.infer<typeof MarketInsightsQuerySchema>;

// ============================================
// Helper Functions
// ============================================

/**
 * Parse and validate query parameters from URLSearchParams
 */
export function parseSearchParams<T extends z.ZodSchema>(
  searchParams: URLSearchParams,
  schema: T
): z.SafeParseReturnType<z.input<T>, z.output<T>> {
  const params: Record<string, string | undefined> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return schema.safeParse(params);
}

/**
 * Create a standardized error response for validation failures
 */
export function createValidationErrorResponse(error: z.ZodError) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request parameters',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    },
  };
}
