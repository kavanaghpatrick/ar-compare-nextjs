import { NextRequest } from 'next/server';
import arGlassesData from '@/data/products';
import logger from '@/lib/logger';
import { apiSuccess, notFound, internalError, rateLimited } from '@/lib/api-response';
import { apiRateLimiter, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/products/[id] - Get single product by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
    const { id } = await context.params;

    const product = arGlassesData.find(p => p.id === id);

    if (!product) {
      return notFound(`Product with ID '${id}' not found`);
    }

    return apiSuccess(product, {
      headers: {
        ...rateLimitHeaders,
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    logger.error('Error fetching product:', error);
    return internalError('Failed to fetch product');
  }
}