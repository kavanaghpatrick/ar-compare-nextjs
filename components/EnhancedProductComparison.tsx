'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  GitCompare,
  Plus,
  X,
  Star,
  Target,
  Zap,
  DollarSign,
  RefreshCw,
  Download,
  Share2,
  Crown,
  Check,
  AlertTriangle,
  Info,
  BarChart3,
  ArrowUpDown,
  Search
} from 'lucide-react';

// Types
interface ProductData {
  productId: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  availability: string;
  scores: {
    displayQuality: number;
    valueForMoney: number;
    buildQuality: number;
    innovation: number;
    userExperience: number;
    overall: number;
  };
  specifications: {
    display: {
      type: string;
      resolution: string;
      refreshRate: string;
      brightness: string;
      fov: string;
    };
    design: {
      weight: string;
      material: string;
      dimensions?: string;
    };
    audio: {
      type: string;
      features: string[];
    };
    connectivity: {
      ports: string[];
      wireless: string[];
      compatibility: string[];
    };
    features: string[];
    pros: string[];
    cons: string[];
  };
  useCases: string[];
  targetAudience: string[];
}

interface ComparisonMetric {
  key: string;
  label: string;
  type: 'score' | 'spec' | 'feature' | 'price';
  category: string;
  important?: boolean;
}

interface EnhancedProductComparisonProps {
  className?: string;
  initialProducts?: string[];
  maxProducts?: number;
}

const EnhancedProductComparison: React.FC<EnhancedProductComparisonProps> = ({ 
  className = '', 
  initialProducts = [],
  maxProducts = 4
}) => {
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'overview' | 'detailed' | 'head-to-head'>('overview');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [showSpecs, setShowSpecs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const comparisonMetrics: ComparisonMetric[] = [
    { key: 'overall', label: 'Overall Score', type: 'score', category: 'Performance', important: true },
    { key: 'price', label: 'Price', type: 'price', category: 'Value', important: true },
    { key: 'displayQuality', label: 'Display Quality', type: 'score', category: 'Display' },
    { key: 'valueForMoney', label: 'Value for Money', type: 'score', category: 'Value', important: true },
    { key: 'buildQuality', label: 'Build Quality', type: 'score', category: 'Design' },
    { key: 'innovation', label: 'Innovation', type: 'score', category: 'Technology' },
    { key: 'userExperience', label: 'User Experience', type: 'score', category: 'Usability' },
    { key: 'display.type', label: 'Display Type', type: 'spec', category: 'Display' },
    { key: 'display.fov', label: 'Field of View', type: 'spec', category: 'Display', important: true },
    { key: 'display.brightness', label: 'Brightness', type: 'spec', category: 'Display' },
    { key: 'design.weight', label: 'Weight', type: 'spec', category: 'Design', important: true },
    { key: 'audio.type', label: 'Audio', type: 'spec', category: 'Audio' }
  ];

  // Load product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch competitive matrix and product details
        const [matrixResponse, productsResponse] = await Promise.all([
          fetch('/api/market/insights?type=competitive-matrix'),
          fetch('/api/products')
        ]);
        
        const [matrixResult, productsResult] = await Promise.all([
          matrixResponse.json(),
          productsResponse.json()
        ]);
        
        if (matrixResult.success && productsResult.success) {
          const transformedData = transformProductData(matrixResult.data, productsResult.data);
          setAllProducts(transformedData);
          
          // Load initial products if provided
          if (initialProducts.length > 0) {
            const initialSelected = transformedData.filter(p => 
              initialProducts.includes(p.productId)
            );
            setSelectedProducts(initialSelected);
          }
        } else {
          setError('Failed to load product data');
        }
      } catch (err) {
        setError('Failed to connect to product service');
        console.error('Product comparison data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform and merge product data
  const transformProductData = (competitiveMatrix: any, productData: any[]): ProductData[] => {
    const productsMap = new Map<string, ProductData>();
    
    // Initialize with basic product data
    productData.forEach(product => {
      const productId = product.id;
      productsMap.set(productId, {
        productId,
        name: product.name || product.fullName,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        availability: product.availability || 'Available',
        scores: {
          displayQuality: 0,
          valueForMoney: 0,
          buildQuality: 0,
          innovation: 0,
          userExperience: 0,
          overall: 0
        },
        specifications: {
          display: {
            type: product.specifications?.display?.type || 'N/A',
            resolution: product.specifications?.display?.resolution || 'N/A',
            refreshRate: product.specifications?.display?.refreshRate || 'N/A',
            brightness: product.specifications?.display?.brightness || 'N/A',
            fov: product.specifications?.display?.fov || 'N/A'
          },
          design: {
            weight: product.specifications?.design?.weight || 'N/A',
            material: product.specifications?.design?.material || 'N/A',
            dimensions: product.specifications?.design?.dimensions
          },
          audio: {
            type: product.specifications?.audio?.type || 'N/A',
            features: product.specifications?.audio?.features || []
          },
          connectivity: {
            ports: product.specifications?.connectivity?.ports || [],
            wireless: product.specifications?.connectivity?.wireless || [],
            compatibility: product.specifications?.connectivity?.compatibility || []
          },
          features: product.keyFeatures || [],
          pros: product.pros || [],
          cons: product.cons || []
        },
        useCases: getUseCases(productId),
        targetAudience: getTargetAudience(productId)
      });
    });
    
    // Add competitive scores
    Object.entries(competitiveMatrix).forEach(([metric, rankings]) => {
      (rankings as any[]).forEach((ranking) => {
        const product = productsMap.get(ranking.productId);
        if (product) {
          product.scores[metric as keyof typeof product.scores] = ranking.score;
        }
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

  // Helper functions for product metadata
  const getUseCases = (productId: string): string[] => {
    const useCaseMap: { [key: string]: string[] } = {
      'xreal-one-pro': ['Gaming', 'Entertainment', 'Productivity', 'Development'],
      'xreal-one': ['Gaming', 'Entertainment', 'Productivity'],
      'viture-pro-xr': ['Productivity', 'Entertainment', 'Content Creation'],
      'rokid-ar-spatial': ['Development', 'Productivity', 'Research'],
      'rayneo-x3-pro': ['Enterprise', 'Development', 'Industrial'],
      'rayneo-air-3s': ['Entertainment', 'Casual Use'],
      'brilliant-labs-frame': ['Development', 'Research', 'Education'],
      'even-realities-g1': ['Lifestyle', 'Navigation', 'Daily Use']
    };
    return useCaseMap[productId] || [];
  };

  const getTargetAudience = (productId: string): string[] => {
    const audienceMap: { [key: string]: string[] } = {
      'xreal-one-pro': ['Gamers', 'Professionals', 'Early Adopters'],
      'xreal-one': ['Consumers', 'Gamers', 'Students'],
      'viture-pro-xr': ['Professionals', 'Content Creators', 'Remote Workers'],
      'rokid-ar-spatial': ['Developers', 'Researchers', 'Early Adopters'],
      'rayneo-x3-pro': ['Enterprise Users', 'Developers', 'Industrial Workers'],
      'rayneo-air-3s': ['Students', 'Budget Users', 'First-time Users'],
      'brilliant-labs-frame': ['Developers', 'Students', 'Researchers'],
      'even-realities-g1': ['Lifestyle Users', 'Fashion Conscious', 'Daily Commuters']
    };
    return audienceMap[productId] || [];
  };

  // Available products for selection (filtered)
  const availableProducts = useMemo(() => {
    let filtered = allProducts.filter(product => 
      !selectedProducts.some(selected => selected.productId === product.productId)
    );
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.specifications.features.some(feature => 
          feature.toLowerCase().includes(term)
        )
      );
    }
    
    return filtered;
  }, [allProducts, selectedProducts, searchTerm]);

  // Comparison data analysis
  const comparisonAnalysis = useMemo(() => {
    if (selectedProducts.length < 2) return null;
    
    const analysis = {
      winner: { overall: '', displayQuality: '', valueForMoney: '', innovation: '' },
      priceRange: { min: Infinity, max: 0 },
      commonFeatures: [] as string[],
      uniqueFeatures: {} as { [key: string]: string[] },
      recommendations: [] as string[]
    };
    
    // Find winners for each category
    ['overall', 'displayQuality', 'valueForMoney', 'innovation'].forEach(metric => {
      const winner = selectedProducts.reduce((prev, current) => 
        (current.scores[metric as keyof typeof current.scores] > 
         prev.scores[metric as keyof typeof prev.scores]) ? current : prev
      );
      analysis.winner[metric as keyof typeof analysis.winner] = winner.name;
    });
    
    // Price analysis
    selectedProducts.forEach(product => {
      analysis.priceRange.min = Math.min(analysis.priceRange.min, product.price);
      analysis.priceRange.max = Math.max(analysis.priceRange.max, product.price);
    });
    
    // Feature analysis
    const allFeatures = selectedProducts.flatMap(p => p.specifications.features);
    const featureCounts = allFeatures.reduce((acc, feature) => {
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    analysis.commonFeatures = Object.entries(featureCounts)
      .filter(([_, count]) => count === selectedProducts.length)
      .map(([feature, _]) => feature);
    
    selectedProducts.forEach(product => {
      analysis.uniqueFeatures[product.name] = product.specifications.features.filter(
        feature => featureCounts[feature] === 1
      );
    });
    
    // Generate recommendations
    if (selectedProducts.length === 2) {
      const [product1, product2] = selectedProducts;
      if (product1.scores.overall > product2.scores.overall) {
        analysis.recommendations.push(`${product1.name} offers better overall performance`);
      }
      if (product2.scores.valueForMoney > product1.scores.valueForMoney) {
        analysis.recommendations.push(`${product2.name} provides better value for money`);
      }
    }
    
    return analysis;
  }, [selectedProducts]);

  // Handler functions
  const addProduct = (product: ProductData) => {
    if (selectedProducts.length < maxProducts) {
      setSelectedProducts(prev => [...prev, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const exportComparison = () => {
    const comparisonData = {
      products: selectedProducts,
      analysis: comparisonAnalysis,
      timestamp: new Date().toISOString(),
      mode: comparisonMode
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-comparison-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <Card>
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
            <p>Error loading comparison data: {error}</p>
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
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Enhanced Product Comparison
                {selectedProducts.length > 0 && (
                  <Badge variant="secondary">
                    {selectedProducts.length} products
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highlight-differences"
                    checked={highlightDifferences}
                    onCheckedChange={(checked) => setHighlightDifferences(checked === true)}
                  />
                  <label htmlFor="highlight-differences" className="text-sm">
                    Highlight differences
                  </label>
                </div>
                
                {selectedProducts.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={exportComparison}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Product Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products to add..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Mid-Range">Mid-Range</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {availableProducts.length > 0 && selectedProducts.length < maxProducts && (
                <div className="flex flex-wrap gap-2">
                  {availableProducts.slice(0, 6).map(product => (
                    <Button
                      key={product.productId}
                      variant="outline"
                      size="sm"
                      onClick={() => addProduct(product)}
                      className="text-sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {product.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Comparison Content */}
        {selectedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products selected</h3>
              <p className="text-gray-600 mb-4">
                Add products to start comparing their features, specifications, and performance.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {allProducts.slice(0, 4).map(product => (
                  <Button
                    key={product.productId}
                    variant="outline"
                    onClick={() => addProduct(product)}
                  >
                    Add {product.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={comparisonMode} onValueChange={(value) => setComparisonMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Specs</TabsTrigger>
              <TabsTrigger value="head-to-head">Head-to-Head</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <ComparisonOverview 
                products={selectedProducts}
                onRemoveProduct={removeProduct}
                highlightDifferences={highlightDifferences}
              />
              
              {comparisonAnalysis && (
                <ComparisonInsights analysis={comparisonAnalysis} />
              )}
            </TabsContent>

            {/* Detailed Specs Tab */}
            <TabsContent value="detailed">
              <DetailedSpecsComparison 
                products={selectedProducts}
                onRemoveProduct={removeProduct}
                metrics={comparisonMetrics}
                highlightDifferences={highlightDifferences}
              />
            </TabsContent>

            {/* Head-to-Head Tab */}
            <TabsContent value="head-to-head">
              <HeadToHeadComparison 
                products={selectedProducts}
                onRemoveProduct={removeProduct}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </TooltipProvider>
  );
};

// Comparison Overview Component
const ComparisonOverview: React.FC<{
  products: ProductData[];
  onRemoveProduct: (productId: string) => void;
  highlightDifferences: boolean;
}> = ({ products, onRemoveProduct, highlightDifferences }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <Card key={product.productId} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
            onClick={() => onRemoveProduct(product.productId)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{product.brand}</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">${product.price}</span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{product.scores.overall}</div>
                <div className="text-xs text-gray-500">Overall Score</div>
              </div>
            </div>
            
            {/* Score Bars */}
            <div className="space-y-2">
              {Object.entries(product.scores).filter(([key]) => key !== 'overall').map(([key, score]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Features */}
            <div>
              <h5 className="text-sm font-medium mb-2">Key Features</h5>
              <div className="flex flex-wrap gap-1">
                {product.specifications.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {product.specifications.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.specifications.features.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick Specs */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Display:</span>
                <span className="font-medium">{product.specifications.display.type}</span>
              </div>
              <div className="flex justify-between">
                <span>FOV:</span>
                <span className="font-medium">{product.specifications.display.fov}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight:</span>
                <span className="font-medium">{product.specifications.design.weight}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Comparison Insights Component
const ComparisonInsights: React.FC<{
  analysis: any;
}> = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Comparison Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Crown className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Overall Winner</div>
            <div className="font-semibold text-yellow-800">{analysis.winner.overall}</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Best Value</div>
            <div className="font-semibold text-green-800">{analysis.winner.valueForMoney}</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Zap className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Most Innovative</div>
            <div className="font-semibold text-purple-800">{analysis.winner.innovation}</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Price Range</div>
            <div className="font-semibold text-blue-800">
              ${analysis.priceRange.min}-${analysis.priceRange.max}
            </div>
          </div>
        </div>
        
        {analysis.commonFeatures.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Common Features</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.commonFeatures.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary">
                  <Check className="h-3 w-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {analysis.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Detailed Specs Comparison Component
const DetailedSpecsComparison: React.FC<{
  products: ProductData[];
  onRemoveProduct: (productId: string) => void;
  metrics: ComparisonMetric[];
  highlightDifferences: boolean;
}> = ({ products, onRemoveProduct, metrics, highlightDifferences }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Specification</th>
                {products.map(product => (
                  <th key={product.productId} className="text-center p-3 min-w-[150px] relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-5 w-5 p-0"
                      onClick={() => onRemoveProduct(product.productId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => (
                <SpecRow 
                  key={metric.key}
                  metric={metric}
                  products={products}
                  highlightDifferences={highlightDifferences}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Spec Row Component
const SpecRow: React.FC<{
  metric: ComparisonMetric;
  products: ProductData[];
  highlightDifferences: boolean;
}> = ({ metric, products, highlightDifferences }) => {
  const values = products.map(product => {
    if (metric.type === 'price') {
      return product.price;
    } else if (metric.type === 'score') {
      return product.scores[metric.key as keyof typeof product.scores];
    } else if (metric.type === 'spec') {
      const keys = metric.key.split('.');
      let value: any = product.specifications;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || 'N/A';
    }
    return 'N/A';
  });
  
  const allSame = new Set(values).size === 1;
  const isNumeric = typeof values[0] === 'number';
  const maxValue = isNumeric ? Math.max(...(values as number[])) : null;
  
  return (
    <tr className={`border-b ${metric.important ? 'bg-blue-50' : ''}`}>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {metric.important && <Star className="h-4 w-4 text-yellow-500" />}
          <span className="font-medium">{metric.label}</span>
        </div>
      </td>
      {products.map((product, index) => {
        const value = values[index];
        const isHighest = isNumeric && value === maxValue && maxValue !== null;
        const isDifferent = highlightDifferences && !allSame;
        
        return (
          <td 
            key={product.productId} 
            className={`text-center p-3 ${
              isDifferent ? (isHighest ? 'bg-green-100' : 'bg-yellow-50') : ''
            }`}
          >
            <span className={`${isHighest ? 'font-bold text-green-700' : ''}`}>
              {metric.type === 'price' ? `$${value}` : value}
            </span>
          </td>
        );
      })}
    </tr>
  );
};

// Head-to-Head Comparison Component
const HeadToHeadComparison: React.FC<{
  products: ProductData[];
  onRemoveProduct: (productId: string) => void;
}> = ({ products, onRemoveProduct }) => {
  if (products.length !== 2) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Head-to-Head Comparison</h3>
          <p className="text-gray-600">
            Select exactly 2 products for head-to-head comparison.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const [product1, product2] = products;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {product1.name} vs {product2.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HeadToHeadBattle product1={product1} product2={product2} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {product1.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveProduct(product1.productId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailCard product={product1} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {product2.name}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveProduct(product2.productId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailCard product={product2} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Head-to-Head Battle Component
const HeadToHeadBattle: React.FC<{
  product1: ProductData;
  product2: ProductData;
}> = ({ product1, product2 }) => {
  const battles = [
    { key: 'overall', label: 'Overall Score' },
    { key: 'displayQuality', label: 'Display Quality' },
    { key: 'valueForMoney', label: 'Value for Money' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'userExperience', label: 'User Experience' }
  ];
  
  let product1Wins = 0;
  let product2Wins = 0;
  
  return (
    <div className="space-y-4">
      {battles.map(battle => {
        const score1 = product1.scores[battle.key as keyof typeof product1.scores];
        const score2 = product2.scores[battle.key as keyof typeof product2.scores];
        const winner = score1 > score2 ? 1 : score1 < score2 ? 2 : 0;
        
        if (winner === 1) product1Wins++;
        if (winner === 2) product2Wins++;
        
        return (
          <div key={battle.key} className="flex items-center gap-4">
            <div className={`text-right flex-1 ${winner === 1 ? 'font-bold text-green-600' : ''}`}>
              {score1}
            </div>
            <div className="text-center min-w-[120px]">
              <div className="text-sm font-medium">{battle.label}</div>
              {winner === 1 && <Crown className="h-4 w-4 text-yellow-500 mx-auto" />}
              {winner === 2 && <Crown className="h-4 w-4 text-yellow-500 mx-auto" />}
              {winner === 0 && <div className="h-4"></div>}
            </div>
            <div className={`text-left flex-1 ${winner === 2 ? 'font-bold text-green-600' : ''}`}>
              {score2}
            </div>
          </div>
        );
      })}
      
      <div className="border-t pt-4">
        <div className="text-center">
          <div className="text-lg font-bold">
            {product1Wins > product2Wins ? `${product1.name} Wins!` :
             product2Wins > product1Wins ? `${product2.name} Wins!` :
             'It\'s a Tie!'}
          </div>
          <div className="text-sm text-gray-600">
            {product1.name}: {product1Wins} wins • {product2.name}: {product2Wins} wins
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Detail Card Component
const ProductDetailCard: React.FC<{
  product: ProductData;
}> = ({ product }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">${product.price}</div>
        <div className="text-sm text-gray-500">{product.category}</div>
      </div>
      
      <div>
        <h5 className="font-medium mb-2 text-green-600">Pros</h5>
        <ul className="space-y-1">
          {product.specifications.pros.map((pro, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              {pro}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium mb-2 text-red-600">Cons</h5>
        <ul className="space-y-1">
          {product.specifications.cons.map((con, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              {con}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium mb-2">Best For</h5>
        <div className="flex flex-wrap gap-1">
          {product.useCases.map((useCase, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {useCase}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductComparison;