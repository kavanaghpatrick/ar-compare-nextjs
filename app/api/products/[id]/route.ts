import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products'; // This imports enhanced data by default
import { ApiErrorResponse } from '@/types';
import logger from '@/lib/logger';

// GET /api/products/[id] - Get single product by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = arGlassesData.find(p => p.id === id);

    if (!product) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: 'Product not found'
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    logger.error('Error fetching product:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: 'Failed to fetch product'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}