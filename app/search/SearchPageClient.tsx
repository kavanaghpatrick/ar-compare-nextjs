'use client';

import Link from 'next/link';
import arGlassesData from '@/data/products';
import { Product } from '@/types';
import { PageLayout } from '@/components/PageLayout';

interface SearchPageClientProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}

// Search function
function searchProducts(
  products: Product[],
  query: string,
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Product[] {
  let filtered = [...products];

  // Filter by search query
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  // Filter by brand
  if (filters.brand) {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!);
  }

  return filtered;
}

// Sort function
function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'relevance':
    default:
      return sorted; // Keep original order for relevance
  }
}

export function SearchPageClient({ searchParams }: SearchPageClientProps) {
  const query = searchParams.q || '';
  const sort = searchParams.sort || 'relevance';
  
  const filters = {
    category: searchParams.category,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
  };

  // Get search results
  const searchResults = searchProducts(arGlassesData, query, filters);
  const results = sortProducts(searchResults, sort);

  // Get filter options
  const categories = Array.from(new Set(arGlassesData.map(p => p.category)));
  const brands = Array.from(new Set(arGlassesData.map(p => p.brand)));

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            {query ? `Search Results for "${query}"` : 'Search AR Glasses'}
          </h1>
          <p className="text-xl text-white/80">
            {query 
              ? `Find AR glasses matching your search criteria`
              : 'Discover the perfect AR glasses for your needs'
            }
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          <form method="GET" className="space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search-query" className="block text-white/80 mb-2">Search</label>
              <input
                id="search-query"
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search AR glasses..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="category-filter" className="block text-white/80 mb-2">Category</label>
                <select
                  id="category-filter"
                  name="category"
                  defaultValue={filters.category || ''}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="brand-filter" className="block text-white/80 mb-2">Brand</label>
                <select
                  id="brand-filter"
                  name="brand"
                  defaultValue={filters.brand || ''}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="min-price" className="block text-white/80 mb-2">Min Price</label>
                <input
                  id="min-price"
                  name="minPrice"
                  type="number"
                  defaultValue={filters.minPrice || ''}
                  placeholder="$0"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="max-price" className="block text-white/80 mb-2">Max Price</label>
                <input
                  id="max-price"
                  name="maxPrice"
                  type="number"
                  defaultValue={filters.maxPrice || ''}
                  placeholder="$1000"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Results header with sort */}
          {(query || Object.values(filters).some(Boolean)) && (
            <div className="mb-6 flex justify-between items-center">
              <div className="text-white/60">
                Showing {results.length} {results.length === 1 ? 'result' : 'results'}
              </div>
              <div>
                <label htmlFor="sort" className="text-white/60 mr-2">Sort by:</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => {
                    const newParams = new URLSearchParams({
                      ...(query && { q: query }),
                      ...(filters.category && { category: filters.category }),
                      ...(filters.brand && { brand: filters.brand }),
                      ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
                      ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
                      ...(e.target.value !== 'relevance' && { sort: e.target.value }),
                    });
                    window.location.href = `/search?${newParams.toString()}`;
                  }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          )}

          {/* Product Results */}
          {results.length > 0 ? (
            <div className="products-grid">
              {results.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <div className="product-icon">🥽</div>
                  </div>
                  
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-price">${product.price}</div>
                  
                  <div className="rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < product.rating ? 'star-filled' : 'star-empty'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">{product.rating}</span>
                  </div>
                  
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span>📐</span>
                      <span>{product.specifications.display.fov}</span>
                    </div>
                    <div className="spec-item">
                      <span>⚖️</span>
                      <span>{product.specifications.design.weight}</span>
                    </div>
                    <div className="spec-item">
                      <span>💰</span>
                      <span>${product.price}</span>
                    </div>
                    <div className="spec-item">
                      <span>📱</span>
                      <span>{product.brand}</span>
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <div className="action-btn-group">
                      <Link 
                        href={`/products/${product.id}`}
                        className="action-btn action-btn-details"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-white/60 mb-6">
                Try adjusting your search criteria or browse all products.
              </p>
              <Link href="/" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}