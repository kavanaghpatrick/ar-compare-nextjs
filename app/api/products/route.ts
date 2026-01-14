import { NextRequest } from 'next/server';
import { arGlassesData } from '@/data/products';
import { Product } from '@/types';
import logger from '@/lib/logger';
import { ProductFiltersSchema, parseSearchParams } from '@/lib/api-validation';
import { apiSuccess, internalError, validationError, rateLimited } from '@/lib/api-response';
import { apiRateLimiter, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.ip ||
                   'unknown';
  const rateLimitResult = apiRateLimiter(clientIp);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return rateLimited(rateLimitResult.retryAfter!, rateLimitHeaders);
  }

  try {
    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters with Zod
    const validationResult = parseSearchParams(searchParams, ProductFiltersSchema);

    if (!validationResult.success) {
      const zodError = validationResult.error;
      return validationError('Invalid request parameters', zodError.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })));
    }

    const { category, brand, minPrice, maxPrice, sortBy, sortOrder, limit, offset } = validationResult.data;

    let filteredProducts: Product[] = [...arGlassesData];

    // Apply filters (values are already validated and typed by Zod)
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(
        product => product.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'releaseDate':
          aValue = new Date(a.releaseDate);
          bValue = new Date(b.releaseDate);
          break;
        case 'name':
        default:
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // Apply pagination (values are already validated by Zod)
    let paginatedProducts = filteredProducts;
    if (limit !== undefined) {
      const offsetNum = offset ?? 0;
      paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limit);
    }

    const offsetNum = offset ?? 0;
    const limitNum = limit ?? filteredProducts.length;

    return apiSuccess(
      {
        products: paginatedProducts,
        filters: {
          category: category ?? null,
          brand: brand ?? null,
          minPrice: minPrice !== undefined ? String(minPrice) : null,
          maxPrice: maxPrice !== undefined ? String(maxPrice) : null,
          sortBy,
          sortOrder,
        },
      },
      {
        pagination: {
          total: filteredProducts.length,
          count: paginatedProducts.length,
          offset: offsetNum,
          limit: limitNum,
          hasMore: offsetNum + paginatedProducts.length < filteredProducts.length,
        },
        headers: {
          ...rateLimitHeaders,
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    logger.error('Error fetching products:', error);
    return internalError('Failed to fetch products');
  }
}