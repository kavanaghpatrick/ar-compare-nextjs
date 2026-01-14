import { NextResponse } from 'next/server';
import { arGlassesData } from '@/data/products'; // Import basic product data
import { Product, ProductsApiResponse, ApiErrorResponse } from '@/types';
import logger from '@/lib/logger';
import { ProductFiltersSchema, parseSearchParams, createValidationErrorResponse } from '@/lib/api-validation';

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // FIXED: Validate and parse query parameters with Zod
    const validationResult = parseSearchParams(searchParams, ProductFiltersSchema);

    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.error),
        { status: 400 }
      );
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

    const response: ProductsApiResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      count: paginatedProducts.length,
      filters: {
        category: category ?? null,
        brand: brand ?? null,
        minPrice: minPrice !== undefined ? String(minPrice) : null,
        maxPrice: maxPrice !== undefined ? String(maxPrice) : null,
        sortBy,
        sortOrder
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    logger.error('Error fetching products:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: 'Failed to fetch products'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}