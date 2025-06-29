'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  X, 
  Star, 
  TrendingUp, 
  Target, 
  Zap,
  Award,
  DollarSign,
  Eye,
  RefreshCw,
  Save,
  BookOpen,
  History,
  Sparkles,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Types
interface SearchFilters {
  query: string;
  priceRange: [number, number];
  scoreThresholds: {
    displayQuality: number;
    valueForMoney: number;
    buildQuality: number;
    innovation: number;
    userExperience: number;
    overall: number;
  };
  categories: string[];
  brands: string[];
  features: string[];
  useCases: string[];
  targetAudience: string[];
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  timestamp: string;
  resultCount: number;
}

interface SearchResult {
  productId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  scores: {
    displayQuality: number;
    valueForMoney: number;
    buildQuality: number;
    innovation: number;
    userExperience: number;
    overall: number;
  };
  features: string[];
  useCases: string[];
  targetAudience: string[];
  matchScore: number;
  highlightedFeatures: string[];
}

interface AdvancedMarketSearchProps {
  className?: string;
  onProductSelect?: (productId: string) => void;
}

const AdvancedMarketSearch: React.FC<AdvancedMarketSearchProps> = ({ 
  className = '', 
  onProductSelect 
}) => {
  const [products, setProducts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced' | 'ai'>('simple');
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    priceRange: [200, 1200],
    scoreThresholds: {
      displayQuality: 0,
      valueForMoney: 0,
      buildQuality: 0,
      innovation: 0,
      userExperience: 0,
      overall: 0
    },
    categories: [],
    brands: [],
    features: [],
    useCases: [],
    targetAudience: []
  });

  // Load data and search options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch competitive matrix data
        const response = await fetch('/api/market/insights?type=competitive-matrix');
        const result = await response.json();
        
        if (result.success) {
          const transformedData = transformToSearchResults(result.data);
          setProducts(transformedData);
        } else {
          setError('Failed to load search data');
        }
        
        // Load saved searches from localStorage
        const saved = localStorage.getItem('market-search-saved');
        if (saved) {
          try {
            setSavedSearches(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse saved searches:', e);
          }
        }
        
        // Load search history
        const history = localStorage.getItem('market-search-history');
        if (history) {
          try {
            setSearchHistory(JSON.parse(history));
          } catch (e) {
            console.error('Failed to parse search history:', e);
          }
        }
      } catch (err) {
        setError('Failed to connect to search service');
        console.error('Search data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform competitive matrix data to search results
  const transformToSearchResults = (competitiveMatrix: any): SearchResult[] => {
    const productsMap = new Map<string, SearchResult>();
    
    // Product metadata
    const productMetadata: { [key: string]: { 
      features: string[]; 
      useCases: string[]; 
      targetAudience: string[];
      category: string;
      price: number;
    }} = {
      'xreal-one-pro': {
        features: ['57° FOV', 'X1 Chip', 'Bose Audio', '3DoF Tracking', 'Titanium Frame'],
        useCases: ['Gaming', 'Entertainment', 'Productivity', 'Development'],
        targetAudience: ['Gamers', 'Professionals', 'Early Adopters', 'Content Creators'],
        category: 'Premium',
        price: 599
      },
      'xreal-one': {
        features: ['50° FOV', 'Micro-OLED', 'Wide Compatibility', 'Lightweight'],
        useCases: ['Gaming', 'Entertainment', 'Productivity'],
        targetAudience: ['Consumers', 'Gamers', 'Students'],
        category: 'Mid-Range',
        price: 499
      },
      'viture-pro-xr': {
        features: ['4000 nits', '2D-to-3D', 'Electrochromic Dimming', 'AI Workspace'],
        useCases: ['Productivity', 'Entertainment', 'Content Creation'],
        targetAudience: ['Professionals', 'Content Creators', 'Remote Workers'],
        category: 'Premium',
        price: 449
      },
      'rokid-ar-spatial': {
        features: ['AI Integration', 'Scene Recognition', 'Spatial Computing', 'LLM'],
        useCases: ['Development', 'Productivity', 'Research'],
        targetAudience: ['Developers', 'Researchers', 'Early Adopters'],
        category: 'Premium',
        price: 598
      },
      'rayneo-x3-pro': {
        features: ['SLAM Navigation', 'Gesture Control', 'Translation', 'Enterprise Features'],
        useCases: ['Enterprise', 'Development', 'Industrial'],
        targetAudience: ['Enterprise Users', 'Developers', 'Industrial Workers'],
        category: 'Enterprise',
        price: 899
      },
      'rayneo-air-3s': {
        features: ['Lightweight', 'Multi-device', 'Entry-level', 'Affordable'],
        useCases: ['Entertainment', 'Casual Use'],
        targetAudience: ['Students', 'Budget Users', 'First-time Users'],
        category: 'Budget',
        price: 269
      },
      'brilliant-labs-frame': {
        features: ['Open Source', 'AI Integration', 'Developer-friendly', 'Lightweight'],
        useCases: ['Development', 'Research', 'Education'],
        targetAudience: ['Developers', 'Students', 'Researchers', 'Makers'],
        category: 'Developer',
        price: 349
      },
      'even-realities-g1': {
        features: ['Everyday Wear', 'Micro-LED', 'Navigation', 'Luxury Design'],
        useCases: ['Lifestyle', 'Navigation', 'Daily Use'],
        targetAudience: ['Lifestyle Users', 'Fashion Conscious', 'Daily Commuters'],
        category: 'Lifestyle',
        price: 599
      }
    };
    
    Object.entries(competitiveMatrix).forEach(([metric, rankings]) => {
      (rankings as any[]).forEach((ranking) => {
        const productId = ranking.productId;
        const metadata = productMetadata[productId];
        
        if (!metadata) return;
        
        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            productId,
            name: formatProductName(productId),
            brand: extractBrand(productId),
            category: metadata.category,
            price: metadata.price,
            features: metadata.features,
            useCases: metadata.useCases,
            targetAudience: metadata.targetAudience,
            scores: {
              displayQuality: 0,
              valueForMoney: 0,
              buildQuality: 0,
              innovation: 0,
              userExperience: 0,
              overall: 0
            },
            matchScore: 0,
            highlightedFeatures: []
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

  // Search and filtering logic
  const searchResults = useMemo(() => {
    if (products.length === 0) return [];
    
    let filtered = products.filter(product => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Score thresholds
      const scoreKeys = Object.keys(filters.scoreThresholds) as Array<keyof typeof filters.scoreThresholds>;
      for (const scoreKey of scoreKeys) {
        if (product.scores[scoreKey] < filters.scoreThresholds[scoreKey]) {
          return false;
        }
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
      
      // Use cases filter
      if (filters.useCases.length > 0) {
        const hasRequiredUseCase = filters.useCases.some(useCase =>
          product.useCases.some(productUseCase =>
            productUseCase.toLowerCase().includes(useCase.toLowerCase())
          )
        );
        if (!hasRequiredUseCase) return false;
      }
      
      // Target audience filter
      if (filters.targetAudience.length > 0) {
        const hasRequiredAudience = filters.targetAudience.some(audience =>
          product.targetAudience.some(productAudience =>
            productAudience.toLowerCase().includes(audience.toLowerCase())
          )
        );
        if (!hasRequiredAudience) return false;
      }
      
      return true;
    });
    
    // Apply text search and calculate match scores
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      
      filtered = filtered.map(product => {
        let matchScore = 0;
        const highlightedFeatures: string[] = [];
        
        // Name match (highest weight)
        if (product.name.toLowerCase().includes(query)) {
          matchScore += 50;
        }
        
        // Brand match
        if (product.brand.toLowerCase().includes(query)) {
          matchScore += 30;
        }
        
        // Feature matches
        product.features.forEach(feature => {
          if (feature.toLowerCase().includes(query)) {
            matchScore += 20;
            highlightedFeatures.push(feature);
          }
        });
        
        // Use case matches
        product.useCases.forEach(useCase => {
          if (useCase.toLowerCase().includes(query)) {
            matchScore += 15;
          }
        });
        
        // Target audience matches
        product.targetAudience.forEach(audience => {
          if (audience.toLowerCase().includes(query)) {
            matchScore += 10;
          }
        });
        
        return {
          ...product,
          matchScore,
          highlightedFeatures
        };
      }).filter(product => product.matchScore > 0);
    } else {
      // No query, calculate relevance based on overall score
      filtered = filtered.map(product => ({
        ...product,
        matchScore: product.scores.overall,
        highlightedFeatures: []
      }));
    }
    
    // Sort by match score
    return filtered.sort((a, b) => b.matchScore - a.matchScore);
  }, [products, filters]);

  // Get filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const allFeatures = products.flatMap(p => p.features);
    const features = [...new Set(allFeatures)];
    const allUseCases = products.flatMap(p => p.useCases);
    const useCases = [...new Set(allUseCases)];
    const allTargetAudience = products.flatMap(p => p.targetAudience);
    const targetAudience = [...new Set(allTargetAudience)];
    
    return { categories, brands, features, useCases, targetAudience };
  }, [products]);

  // Search handlers
  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
    
    // Add to search history
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)];
      setSearchHistory(newHistory);
      localStorage.setItem('market-search-history', JSON.stringify(newHistory));
    }
  }, [searchHistory]);

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (!name) return;
    
    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
      timestamp: new Date().toISOString(),
      resultCount: searchResults.length
    };
    
    const newSavedSearches = [savedSearch, ...savedSearches.slice(0, 9)];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('market-search-saved', JSON.stringify(newSavedSearches));
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      priceRange: [200, 1200],
      scoreThresholds: {
        displayQuality: 0,
        valueForMoney: 0,
        buildQuality: 0,
        innovation: 0,
        userExperience: 0,
        overall: 0
      },
      categories: [],
      brands: [],
      features: [],
      useCases: [],
      targetAudience: []
    });
  };

  const getAISuggestions = async () => {
    // Simulate AI-powered search suggestions
    const suggestions = [
      'Best AR glasses for gaming under $600',
      'Most innovative AR glasses with AI features',
      'Budget-friendly AR glasses for students',
      'Enterprise AR glasses with advanced tracking',
      'Lightweight AR glasses for daily wear'
    ];
    
    return suggestions;
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <Card>
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
            <p>Error loading search data: {error}</p>
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
        {/* Search Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Advanced Market Search
                {searchResults.length > 0 && (
                  <Badge variant="secondary">{searchResults.length} results</Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as any)} className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="simple">Simple</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="ai">AI Search</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {filters.query || searchResults.length !== products.length ? (
                  <Button variant="outline" size="sm" onClick={handleSaveSearch}>
                    <Save className="h-4 w-4" />
                  </Button>
                ) : null}
                
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Main Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products, brands, features, or use cases..."
                value={filters.query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {filters.query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => handleSearch('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Mode Content */}
            <Tabs value={searchMode} className="w-full">
              {/* Simple Search */}
              <TabsContent value="simple" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </Button>
                  
                  {/* Quick Filter Pills */}
                  <Button
                    variant={filters.priceRange[1] <= 400 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: [200, 400] }))}
                  >
                    Under $400
                  </Button>
                  
                  <Button
                    variant={filters.categories.includes('Premium') ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const isPremium = filters.categories.includes('Premium');
                      setFilters(prev => ({
                        ...prev,
                        categories: isPremium 
                          ? prev.categories.filter(c => c !== 'Premium')
                          : [...prev.categories, 'Premium']
                      }));
                    }}
                  >
                    Premium
                  </Button>
                  
                  <Button
                    variant={filters.scoreThresholds.innovation >= 80 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      scoreThresholds: { ...prev.scoreThresholds, innovation: prev.scoreThresholds.innovation >= 80 ? 0 : 80 }
                    }))}
                  >
                    Innovative
                  </Button>
                </div>
              </TabsContent>

              {/* Advanced Search */}
              <TabsContent value="advanced" className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Use advanced filters to narrow down your search with specific criteria.
                </div>
                {/* Advanced filters will be shown below */}
              </TabsContent>

              {/* AI Search */}
              <TabsContent value="ai" className="space-y-4">
                <AISearchInterface 
                  onSearch={handleSearch}
                  suggestions={getAISuggestions}
                />
              </TabsContent>
            </Tabs>

            {/* Search History and Saved Searches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Recent Searches
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {searchHistory.slice(0, 5).map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleSearch(term)}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {savedSearches.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Saved Searches
                  </h4>
                  <div className="space-y-1">
                    {savedSearches.slice(0, 3).map((saved) => (
                      <Button
                        key={saved.id}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 w-full justify-start"
                        onClick={() => loadSavedSearch(saved)}
                      >
                        <span className="truncate">{saved.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {saved.resultCount}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters Panel */}
        {(showAdvancedFilters || searchMode === 'advanced') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedFiltersPanel 
                filters={filters}
                onFiltersChange={setFilters}
                filterOptions={filterOptions}
              />
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              {searchResults.length > 0 && filters.query && (
                <Badge variant="secondary">
                  Showing {searchResults.length} matches
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find products.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <SearchResultCard
                    key={result.productId}
                    result={result}
                    query={filters.query}
                    onSelect={() => onProductSelect?.(result.productId)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

// Advanced Filters Panel Component
const AdvancedFiltersPanel: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  filterOptions: {
    categories: string[];
    brands: string[];
    features: string[];
    useCases: string[];
    targetAudience: string[];
  };
}> = ({ filters, onFiltersChange, filterOptions }) => {
  const scoreMetrics = [
    { key: 'displayQuality', label: 'Display Quality', icon: Target },
    { key: 'valueForMoney', label: 'Value for Money', icon: DollarSign },
    { key: 'buildQuality', label: 'Build Quality', icon: Award },
    { key: 'innovation', label: 'Innovation', icon: Zap },
    { key: 'userExperience', label: 'User Experience', icon: Star }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
          max={1200}
          min={200}
          step={50}
          className="w-full"
        />
      </div>

      {/* Score Thresholds */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Minimum Scores</label>
        <div className="space-y-2">
          {scoreMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div key={metric.key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs flex-1">{metric.label}</span>
                <Slider
                  value={[filters.scoreThresholds[metric.key as keyof typeof filters.scoreThresholds]]}
                  onValueChange={(value) => onFiltersChange({
                    ...filters,
                    scoreThresholds: {
                      ...filters.scoreThresholds,
                      [metric.key]: value[0]
                    }
                  })}
                  max={100}
                  min={0}
                  step={5}
                  className="w-20"
                />
                <span className="text-xs w-8">
                  {filters.scoreThresholds[metric.key as keyof typeof filters.scoreThresholds]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <FilterCheckboxGroup
        title="Categories"
        options={filterOptions.categories}
        selected={filters.categories}
        onChange={(categories) => onFiltersChange({ ...filters, categories })}
      />

      {/* Brands */}
      <FilterCheckboxGroup
        title="Brands"
        options={filterOptions.brands}
        selected={filters.brands}
        onChange={(brands) => onFiltersChange({ ...filters, brands })}
      />

      {/* Use Cases */}
      <FilterCheckboxGroup
        title="Use Cases"
        options={filterOptions.useCases}
        selected={filters.useCases}
        onChange={(useCases) => onFiltersChange({ ...filters, useCases })}
      />

      {/* Target Audience */}
      <FilterCheckboxGroup
        title="Target Audience"
        options={filterOptions.targetAudience}
        selected={filters.targetAudience}
        onChange={(targetAudience) => onFiltersChange({ ...filters, targetAudience })}
      />
    </div>
  );
};

// Filter Checkbox Group Component
const FilterCheckboxGroup: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ title, options, selected, onChange }) => (
  <div className="space-y-3">
    <label className="text-sm font-medium">{title}</label>
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {options.map(option => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${title}-${option}`}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...selected, option]);
              } else {
                onChange(selected.filter(item => item !== option));
              }
            }}
          />
          <label htmlFor={`${title}-${option}`} className="text-sm cursor-pointer">
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

// AI Search Interface Component
const AISearchInterface: React.FC<{
  onSearch: (query: string) => void;
  suggestions: () => Promise<string[]>;
}> = ({ onSearch, suggestions }) => {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const suggestionsList = await suggestions();
      setAiSuggestions(suggestionsList);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Sparkles className="h-4 w-4" />
        AI-powered search suggestions based on market data and user behavior
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {loadingSuggestions ? (
          <div className="text-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : (
          aiSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left h-auto p-3"
              onClick={() => onSearch(suggestion)}
            >
              <div className="flex items-center gap-2 w-full">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="flex-1">{suggestion}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          ))
        )}
      </div>
      
      <Button variant="outline" size="sm" onClick={loadSuggestions} disabled={loadingSuggestions}>
        <RefreshCw className={`h-4 w-4 mr-2 ${loadingSuggestions ? 'animate-spin' : ''}`} />
        Get New Suggestions
      </Button>
    </div>
  );
};

// Search Result Card Component
const SearchResultCard: React.FC<{
  result: SearchResult;
  query: string;
  onSelect?: () => void;
}> = ({ result, query, onSelect }) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">
                {highlightText(result.name, query)}
              </h3>
              <Badge variant="outline">{result.category}</Badge>
              {result.matchScore > 0 && query && (
                <Badge variant="secondary">
                  {Math.round(result.matchScore)}% match
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {highlightText(result.brand, query)} • ${result.price}
            </p>
            
            <div className="grid grid-cols-5 gap-2 mb-3">
              {Object.entries(result.scores).filter(([key]) => key !== 'overall').map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className="text-xs text-gray-500 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm font-medium">{score}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {result.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant={result.highlightedFeatures.includes(feature) ? "default" : "outline"}
                  className="text-xs"
                >
                  {highlightText(feature, query)}
                </Badge>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              Use cases: {result.useCases.join(', ')}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {result.scores.overall}
            </div>
            <div className="text-xs text-gray-500">Overall Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedMarketSearch;