import { NextRequest } from 'next/server';
import arGlassesData from '@/data/products';
import { EnhancedProduct } from '@/types';
import logger from '@/lib/logger';
import { CompareRequestSchema } from '@/lib/api-validation';
import { apiSuccess, notFound, internalError, validationError, rateLimited } from '@/lib/api-response';
import { compareRateLimiter, getRateLimitHeaders } from '@/lib/rate-limit';

interface ComparisonResult {
  products: EnhancedProduct[];
  comparison: {
    specs: {
      [key: string]: {
        [productId: string]: unknown;
      };
    };
    pros: {
      [productId: string]: string[];
    };
    cons: {
      [productId: string]: string[];
    };
    ratings: {
      [productId: string]: number;
    };
    prices: {
      [productId: string]: {
        current: number;
        original: number;
        currency: string;
      };
    };
  };
}

// POST /api/products/compare - Compare multiple products
export async function POST(request: NextRequest) {
  // Rate limiting (stricter for compare endpoint)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.headers.get('x-real-ip') ||
                   'unknown';
  const rateLimitResult = compareRateLimiter(clientIp);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return rateLimited(rateLimitResult.retryAfter!, rateLimitHeaders);
  }

  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = CompareRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const zodError = validationResult.error;
      return validationError('Invalid request parameters', zodError.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })));
    }

    const { productIds } = validationResult.data;

    const products = productIds
      .map(id => arGlassesData.find(p => p.id === id))
      .filter((product): product is EnhancedProduct => product !== undefined);

    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      return notFound(`Products not found: ${missingIds.join(', ')}`);
    }

    // Build comparison object
    const comparison: ComparisonResult['comparison'] = {
      specs: {},
      pros: {},
      cons: {},
      ratings: {},
      prices: {}
    };

    // Extract specifications for comparison
    const specCategories = ['display', 'design', 'audio', 'connectivity', 'features'];
    
    specCategories.forEach(category => {
      comparison.specs[category] = {};
      products.forEach(product => {
        comparison.specs[category][product.id] = product.specifications[category as keyof typeof product.specifications];
      });
    });

    // Extract pros, cons, ratings, and prices
    products.forEach(product => {
      comparison.pros[product.id] = product.pros;
      comparison.cons[product.id] = product.cons;
      comparison.ratings[product.id] = product.rating;
      comparison.prices[product.id] = {
        current: product.price,
        original: product.originalPrice || product.price,
        currency: product.currency
      };
    });

    return apiSuccess(
      {
        products,
        comparison,
      },
      {
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    logger.error('Error comparing products:', error);
    return internalError('Failed to compare products');
  }
}