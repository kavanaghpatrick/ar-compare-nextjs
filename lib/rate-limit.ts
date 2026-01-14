/**
 * In-memory rate limiting for API routes
 * Simple implementation suitable for single-instance deployments
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
  limit: number;
  resetTime: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  return function checkRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    // Create new record if doesn't exist
    if (!record) {
      const resetTime = now + config.windowMs;
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        limit: config.maxRequests,
        resetTime,
      };
    }

    // Window has expired, reset counter
    if (now > record.resetTime) {
      const resetTime = now + config.windowMs;
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        limit: config.maxRequests,
        resetTime,
      };
    }

    // Window still active
    if (record.count < config.maxRequests) {
      record.count++;
      const remaining = config.maxRequests - record.count;
      return {
        allowed: true,
        remaining,
        limit: config.maxRequests,
        resetTime: record.resetTime,
      };
    }

    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      limit: config.maxRequests,
      resetTime: record.resetTime,
    };
  };
}

// Clean up old entries periodically
let cleanupInterval: NodeJS.Timeout | null = null;

export function startCleanupInterval(intervalMs: number = 3600000) {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, intervalMs);
}

export function stopCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,    // 100 requests per minute
});

export const searchRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,     // 30 searches per minute
});

export const compareRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,     // 20 comparisons per minute
});

// Helper to get rate limit headers
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = String(result.retryAfter);
  }

  return headers;
}
