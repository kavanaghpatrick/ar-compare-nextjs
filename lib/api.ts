import { Product } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ProductsResponse {
  products: Product[];
  total: number;
  count: number;
  filters: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'releaseDate';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ComparisonResult {
  products: Product[];
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

// Client-side API functions
export const api = {
  // Get all products with optional filters
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get single product by ID
  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Product with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Compare multiple products
  async compareProducts(productIds: string[]): Promise<ComparisonResult> {
    const response = await fetch(`${API_BASE_URL}/api/products/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productIds }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to compare products: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.getProducts({ category });
    return response.products;
  },

  // Get products by brand
  async getProductsByBrand(brand: string): Promise<Product[]> {
    const response = await this.getProducts({ brand });
    return response.products;
  },

  // Search products (simple text search)
  async searchProducts(query: string): Promise<Product[]> {
    const response = await this.getProducts();
    const allProducts = response.products;
    
    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
      product.fullName.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.model.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.keyFeatures.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }
};

// Server-side data fetching functions (for use in Server Components)
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  // In server components, we can import data directly
  const arGlassesData = (await import('@/data/products')).default;
  let filteredProducts: Product[] = [...arGlassesData];

  // Apply filters
  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.brand) {
    filteredProducts = filteredProducts.filter(
      product => product.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice!);
  }

  // Apply sorting
  const sortBy = filters.sortBy || 'name';
  const sortOrder = filters.sortOrder || 'asc';

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
  if (filters.limit) {
    const offsetNum = filters.offset || 0;
    paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + filters.limit);
  }

  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    count: paginatedProducts.length,
    filters: {
      category: filters.category,
      brand: filters.brand,
      minPrice: filters.minPrice?.toString(),
      maxPrice: filters.maxPrice?.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    }
  };
}

export async function getProduct(id: string): Promise<Product | null> {
  const arGlassesData = (await import('@/data/products')).default;
  return arGlassesData.find(p => p.id === id) || null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const response = await getProducts({ category });
  return response.products;
}

export async function getProductsByBrand(brand: string): Promise<Product[]> {
  const response = await getProducts({ brand });
  return response.products;
}

export async function getUniqueCategories(): Promise<string[]> {
  const arGlassesData = (await import('@/data/products')).default;
  const categories = new Set(arGlassesData.map(product => product.category));
  return Array.from(categories).sort();
}

export async function getUniqueBrands(): Promise<string[]> {
  const arGlassesData = (await import('@/data/products')).default;
  const brands = new Set(arGlassesData.map(product => product.brand));
  return Array.from(brands).sort();
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const arGlassesData = (await import('@/data/products')).default;
  const prices = arGlassesData.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}