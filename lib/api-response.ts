/**
 * Standardized API response utilities
 * Provides consistent response format across all API endpoints
 */

import { NextResponse } from 'next/server';

// API Response Types
export interface ApiMeta {
  timestamp: string;
  version: string;
  requestId?: string;
  pagination?: {
    total: number;
    count: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
} as const;

// API Version
const API_VERSION = '1.0';

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

// Create success response
export function apiSuccess<T>(
  data: T,
  options?: {
    pagination?: ApiMeta['pagination'];
    headers?: Record<string, string>;
    status?: number;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      requestId: generateRequestId(),
      ...(options?.pagination && { pagination: options.pagination }),
    },
  };

  return NextResponse.json(response, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });
}

// Create error response
export function apiError(
  code: string,
  message: string,
  options?: {
    details?: ApiErrorDetail[];
    status?: number;
    headers?: Record<string, string>;
  }
): NextResponse<ApiErrorResponse> {
  const statusMap: Record<string, number> = {
    [ErrorCodes.VALIDATION_ERROR]: 400,
    [ErrorCodes.BAD_REQUEST]: 400,
    [ErrorCodes.NOT_FOUND]: 404,
    [ErrorCodes.RATE_LIMITED]: 429,
    [ErrorCodes.UNAUTHORIZED]: 401,
    [ErrorCodes.METHOD_NOT_ALLOWED]: 405,
    [ErrorCodes.INTERNAL_ERROR]: 500,
  };

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(options?.details && { details: options.details }),
    },
  };

  return NextResponse.json(response, {
    status: options?.status ?? statusMap[code] ?? 500,
    headers: options?.headers,
  });
}

// Convenience error creators
export function notFound(message: string = 'Resource not found', details?: ApiErrorDetail[]) {
  return apiError(ErrorCodes.NOT_FOUND, message, { details });
}

export function badRequest(message: string, details?: ApiErrorDetail[]) {
  return apiError(ErrorCodes.BAD_REQUEST, message, { details });
}

export function validationError(message: string, details: ApiErrorDetail[]) {
  return apiError(ErrorCodes.VALIDATION_ERROR, message, { details });
}

export function rateLimited(retryAfter: number, headers?: Record<string, string>) {
  return apiError(
    ErrorCodes.RATE_LIMITED,
    `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    {
      headers: {
        'Retry-After': String(retryAfter),
        ...headers,
      },
    }
  );
}

export function internalError(message: string = 'An unexpected error occurred') {
  return apiError(ErrorCodes.INTERNAL_ERROR, message);
}
