'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Star, 
  Heart,
  RefreshCw,
  Download,
  Settings,
  Info,
  Zap,
  Target,
  Award,
  DollarSign
} from 'lucide-react';

// Types
interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  features: string[];
  searchTerm: string;
  scoreRange: [number, number];
}

interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

interface ProductData {
  productId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  features: string[];
  scores: {
    displayQuality: number;
    valueForMoney: number;
    buildQuality: number;
    innovation: number;
    userExperience: number;
    overall: number;
  };
}

interface MarketExplorerProps {
  className?: string;
}

const sortOptions: SortOption[] = [
  { value: 'overall', label: 'Overall Score', direction: 'desc' },
  { value: 'price', label: 'Price', direction: 'asc' },
  { value: 'displayQuality', label: 'Display Quality', direction: 'desc' },
  { value: 'valueForMoney', label: 'Value for Money', direction: 'desc' },
  { value: 'innovation', label: 'Innovation', direction: 'desc' },
  { value: 'name', label: 'Name (A-Z)', direction: 'asc' }
];

const InteractiveMarketExplorer: React.FC<MarketExplorerProps> = ({ className = '' }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'comparison'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [200, 1200],
    categories: [],
    brands: [],
    features: [],
    searchTerm: '',
    scoreRange: [0, 100]
  });
  
  const [sortBy, setSortBy] = useState<string>('overall');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Load market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        // Fetch competitive matrix data
        const response = await fetch('/api/market/insights?type=competitive-matrix');
        const result = await response.json();
        
        if (result.success) {
          // Transform the competitive matrix data into a format suitable for our explorer
          const transformedData = transformCompetitiveData(result.data);
          setProducts(transformedData);
        } else {
          setError('Failed to load market data');
        }
      } catch (err) {
        setError('Failed to connect to market data service');
        console.error('Market explorer data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Transform competitive matrix data
  const transformCompetitiveData = (competitiveMatrix: any): ProductData[] => {
    const productsMap = new Map<string, ProductData>();
    
    // Process each metric to build complete product data
    Object.entries(competitiveMatrix).forEach(([metric, rankings]) => {
      (rankings as any[]).forEach((ranking) => {
        const productId = ranking.productId;
        const productName = formatProductName(productId);
        const brand = extractBrand(productId);
        const category = determineCategory(productId);
        const price = getProductPrice(productId);
        const features = getProductFeatures(productId);
        
        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            productId,
            name: productName,
            brand,
            category,
            price,
            features,
            scores: {
              displayQuality: 0,
              valueForMoney: 0,
              buildQuality: 0,
              innovation: 0,
              userExperience: 0,
              overall: 0
            }
          });
        }
        
        const product = productsMap.get(productId)!;
        product.scores[metric as keyof typeof product.scores] = ranking.score;
      });
    });
    
    // Calculate overall scores
    productsMap.forEach((product) => {
      const scores = product.scores;
      scores.overall = Math.round(
        (scores.displayQuality + scores.valueForMoney + scores.buildQuality + 
         scores.innovation + scores.userExperience) / 5
      );
    });
    
    return Array.from(productsMap.values());
  };

  // Helper functions
  const formatProductName = (productId: string) => {
    return productId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const extractBrand = (productId: string) => {
    const brandMap: { [key: string]: string } = {
      'xreal': 'Xreal',
      'viture': 'Viture',
      'rokid': 'Rokid',
      'rayneo': 'RayNeo',
      'brilliant': 'Brilliant Labs',
      'even': 'Even Realities'
    };
    
    const brand = productId.split('-')[0];
    return brandMap[brand] || brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  const determineCategory = (productId: string) => {
    const categoryMap: { [key: string]: string } = {
      'xreal-one-pro': 'Premium',
      'xreal-one': 'Mid-Range',
      'viture-pro-xr': 'Premium',
      'rokid-ar-spatial': 'Premium',
      'rayneo-x3-pro': 'Enterprise',
      'rayneo-air-3s': 'Budget',
      'brilliant-labs-frame': 'Developer',
      'even-realities-g1': 'Lifestyle'
    };
    
    return categoryMap[productId] || 'Unknown';
  };

  const getProductPrice = (productId: string) => {
    const priceMap: { [key: string]: number } = {
      'xreal-one-pro': 599,
      'xreal-one': 499,
      'viture-pro-xr': 449,
      'rokid-ar-spatial': 598,
      'rayneo-x3-pro': 899,
      'rayneo-air-3s': 269,
      'brilliant-labs-frame': 349,
      'even-realities-g1': 599
    };
    
    return priceMap[productId] || 0;
  };

  const getProductFeatures = (productId: string) => {
    const featuresMap: { [key: string]: string[] } = {
      'xreal-one-pro': ['57° FOV', 'X1 Chip', 'Bose Audio', '3DoF Tracking'],
      'xreal-one': ['50° FOV', 'Micro-OLED', 'Wide Compatibility'],
      'viture-pro-xr': ['4000 nits', '2D-to-3D', 'Electrochromic Dimming'],
      'rokid-ar-spatial': ['AI Integration', 'Scene Recognition', 'Spatial Computing'],
      'rayneo-x3-pro': ['SLAM Navigation', 'Gesture Control', 'Translation'],
      'rayneo-air-3s': ['Lightweight', 'Multi-device', 'Entry-level'],
      'brilliant-labs-frame': ['Open Source', 'AI Integration', 'Developer-friendly'],
      'even-realities-g1': ['Everyday Wear', 'Micro-LED', 'Navigation']
    };
    
    return featuresMap[productId] || [];
  };

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      
      // Features filter
      if (filters.features.length > 0) {
        const hasRequiredFeature = filters.features.some(feature =>
          product.features.some(productFeature =>
            productFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasRequiredFeature) return false;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matches = 
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.features.some(feature => feature.toLowerCase().includes(searchLower));
        if (!matches) return false;
      }
      
      // Score range filter
      const relevantScore = product.scores[sortBy as keyof typeof product.scores] || product.scores.overall;
      if (relevantScore < filters.scoreRange[0] || relevantScore > filters.scoreRange[1]) {
        return false;
      }
      
      return true;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === 'price') {
        aValue = a.price;
        bValue = b.price;
      } else {
        aValue = a.scores[sortBy as keyof typeof a.scores] || a.scores.overall;
        bValue = b.scores[sortBy as keyof typeof b.scores] || b.scores.overall;
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    
    return filtered;
  }, [products, filters, sortBy, sortDirection]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const allFeatures = products.flatMap(p => p.features);
    const features = [...new Set(allFeatures)];
    
    return { categories, brands, features };
  }, [products]);

  // Handler functions
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem('market-explorer-favorites', JSON.stringify([...newFavorites]));
  };

  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else if (newSelection.size < 4) { // Limit to 4 products for comparison
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [200, 1200],
      categories: [],
      brands: [],
      features: [],
      searchTerm: '',
      scoreRange: [0, 100]
    });
    setSortBy('overall');
    setSortDirection('desc');
  };

  const exportData = () => {
    const dataToExport = {
      filters,
      sortBy,
      sortDirection,
      results: filteredAndSortedProducts,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('market-explorer-favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse saved favorites:', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <Card>
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading market data: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Header with Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Interactive Market Explorer
                <Badge variant="secondary">{filteredAndSortedProducts.length} products</Badge>
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Filters</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export Data</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset Filters</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Search and Quick Controls */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, brands, or features..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Advanced Filters */}
          {showFilters && (
            <CardContent className="border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={1200}
                    min={200}
                    step={50}
                    className="w-full"
                  />
                </div>
                
                {/* Score Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
                  </label>
                  <Slider
                    value={filters.scoreRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, scoreRange: value as [number, number] }))}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Categories</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }));
                            } else {
                              setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                            }
                          }}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brands */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Brands</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={filters.brands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, brands: [...prev.brands, brand] }));
                            } else {
                              setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                            }
                          }}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="comparison" disabled={selectedProducts.size === 0}>
                Comparison ({selectedProducts.size})
              </TabsTrigger>
            </TabsList>
            
            {selectedProducts.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts(new Set())}
              >
                Clear Selection
              </Button>
            )}
          </div>

          {/* Grid View */}
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedProducts.map(product => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  isFavorite={favorites.has(product.productId)}
                  isSelected={selectedProducts.has(product.productId)}
                  onToggleFavorite={() => toggleFavorite(product.productId)}
                  onToggleSelection={() => toggleProductSelection(product.productId)}
                  sortBy={sortBy}
                />
              ))}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            <div className="space-y-2">
              {filteredAndSortedProducts.map(product => (
                <ProductListItem
                  key={product.productId}
                  product={product}
                  isFavorite={favorites.has(product.productId)}
                  isSelected={selectedProducts.has(product.productId)}
                  onToggleFavorite={() => toggleFavorite(product.productId)}
                  onToggleSelection={() => toggleProductSelection(product.productId)}
                  sortBy={sortBy}
                />
              ))}
            </div>
          </TabsContent>

          {/* Comparison View */}
          <TabsContent value="comparison">
            <ComparisonView
              products={filteredAndSortedProducts.filter(p => selectedProducts.has(p.productId))}
              onRemoveProduct={(productId) => {
                const newSelection = new Set(selectedProducts);
                newSelection.delete(productId);
                setSelectedProducts(newSelection);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms to find products.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: ProductData;
  isFavorite: boolean;
  isSelected: boolean;
  onToggleFavorite: () => void;
  onToggleSelection: () => void;
  sortBy: string;
}> = ({ product, isFavorite, isSelected, onToggleFavorite, onToggleSelection, sortBy }) => {
  const highlightScore = product.scores[sortBy as keyof typeof product.scores] || product.scores.overall;
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
          </div>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFavorite}
                  className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSelection}
                  className={isSelected ? 'bg-blue-100 text-blue-600' : ''}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSelected ? 'Remove from comparison' : 'Add to comparison'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${product.price}</span>
          <Badge variant="secondary" className="text-sm">
            Score: {highlightScore}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Display Quality</span>
            <span className="font-medium">{product.scores.displayQuality}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${product.scores.displayQuality}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {product.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.features.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Product List Item Component
const ProductListItem: React.FC<{
  product: ProductData;
  isFavorite: boolean;
  isSelected: boolean;
  onToggleFavorite: () => void;
  onToggleSelection: () => void;
  sortBy: string;
}> = ({ product, isFavorite, isSelected, onToggleFavorite, onToggleSelection, sortBy }) => {
  const highlightScore = product.scores[sortBy as keyof typeof product.scores] || product.scores.overall;
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">${product.price}</div>
              <div className="text-sm text-gray-500">Score: {highlightScore}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-center">
                  <div className="font-medium">{product.scores.displayQuality}</div>
                  <div className="text-gray-500">Display</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{product.scores.valueForMoney}</div>
                  <div className="text-gray-500">Value</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{product.scores.innovation}</div>
                  <div className="text-gray-500">Innovation</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{product.scores.userExperience}</div>
                  <div className="text-gray-500">UX</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className={isFavorite ? 'text-red-500' : 'text-gray-400'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSelection}
                className={isSelected ? 'bg-blue-100 text-blue-600' : ''}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Comparison View Component
const ComparisonView: React.FC<{
  products: ProductData[];
  onRemoveProduct: (productId: string) => void;
}> = ({ products, onRemoveProduct }) => {
  const metrics = [
    { key: 'displayQuality', label: 'Display Quality', icon: Target },
    { key: 'valueForMoney', label: 'Value for Money', icon: DollarSign },
    { key: 'buildQuality', label: 'Build Quality', icon: Award },
    { key: 'innovation', label: 'Innovation', icon: Zap },
    { key: 'userExperience', label: 'User Experience', icon: Star }
  ];

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products selected</h3>
          <p className="text-gray-600">
            Select products from the grid or list view to compare them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Card key={product.productId} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => onRemoveProduct(product.productId)}
            >
              ×
            </Button>
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-sm">{product.name}</h3>
              <p className="text-xs text-gray-600">{product.brand}</p>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600 mb-2">${product.price}</div>
              <div className="text-sm text-gray-600 mb-3">Overall: {product.scores.overall}</div>
              <div className="space-y-1">
                {product.features.slice(0, 2).map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Metric</th>
                  {products.map(product => (
                    <th key={product.productId} className="text-center p-3 min-w-[120px]">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Price</td>
                  {products.map(product => (
                    <td key={product.productId} className="text-center p-3">
                      <span className="text-green-600 font-semibold">${product.price}</span>
                    </td>
                  ))}
                </tr>
                
                {metrics.map(metric => {
                  const Icon = metric.icon;
                  return (
                    <tr key={metric.key} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {metric.label}
                        </div>
                      </td>
                      {products.map(product => {
                        const score = product.scores[metric.key as keyof typeof product.scores];
                        const isHighest = score === Math.max(...products.map(p => p.scores[metric.key as keyof typeof p.scores]));
                        return (
                          <td key={product.productId} className="text-center p-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-semibold ${isHighest ? 'text-green-600' : ''}`}>
                                {score}
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    isHighest ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                
                <tr className="border-b bg-gray-50">
                  <td className="p-3 font-semibold">Overall Score</td>
                  {products.map(product => {
                    const isHighest = product.scores.overall === Math.max(...products.map(p => p.scores.overall));
                    return (
                      <td key={product.productId} className="text-center p-3">
                        <span className={`text-lg font-bold ${isHighest ? 'text-green-600' : 'text-blue-600'}`}>
                          {product.scores.overall}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMarketExplorer;