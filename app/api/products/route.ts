import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { EnhancedProduct } from '@/types';

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let filteredProducts: EnhancedProduct[] = [...arGlassesData];

    // Apply filters
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

    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredProducts = filteredProducts.filter(product => product.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredProducts = filteredProducts.filter(product => product.price <= max);
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

    // Apply pagination
    let paginatedProducts = filteredProducts;
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = offset ? parseInt(offset) : 0;
      paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limitNum);
    }

    return NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      count: paginatedProducts.length,
      filters: {
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}