'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target, 
  Zap,
  Award,
  DollarSign,
  Eye,
  RefreshCw,
  Download,
  Maximize2,
  Info
} from 'lucide-react';

// Types
interface ProductData {
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
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  category?: string;
}

interface MarketDataVisualizerProps {
  className?: string;
}

const MarketDataVisualizer: React.FC<MarketDataVisualizerProps> = ({ className = '' }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');
  const [chartType, setChartType] = useState<'bar' | 'radar' | 'scatter'>('bar');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends'>('overview');

  const metrics = [
    { value: 'overall', label: 'Overall Score', icon: Award, color: '#3b82f6' },
    { value: 'displayQuality', label: 'Display Quality', icon: Target, color: '#10b981' },
    { value: 'valueForMoney', label: 'Value for Money', icon: DollarSign, color: '#f59e0b' },
    { value: 'buildQuality', label: 'Build Quality', icon: Zap, color: '#8b5cf6' },
    { value: 'innovation', label: 'Innovation', icon: TrendingUp, color: '#ef4444' },
    { value: 'userExperience', label: 'User Experience', icon: Eye, color: '#06b6d4' }
  ];

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market/insights?type=competitive-matrix');
        const result = await response.json();
        
        if (result.success) {
          const transformedData = transformCompetitiveData(result.data);
          setProducts(transformedData);
        } else {
          setError('Failed to load visualization data');
        }
      } catch (err) {
        setError('Failed to connect to data service');
        console.error('Visualization data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data helper
  const transformCompetitiveData = (competitiveMatrix: any): ProductData[] => {
    const productsMap = new Map<string, ProductData>();
    
    Object.entries(competitiveMatrix).forEach(([metric, rankings]) => {
      (rankings as any[]).forEach((ranking) => {
        const productId = ranking.productId;
        const productName = formatProductName(productId);
        const brand = extractBrand(productId);
        const category = determineCategory(productId);
        const price = getProductPrice(productId);
        
        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            productId,
            name: productName,
            brand,
            category,
            price,
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

  // Computed data for visualizations
  const chartData = useMemo(() => {
    if (products.length === 0) return [];
    
    return products
      .map(product => ({
        label: product.name,
        value: selectedMetric === 'price' ? product.price : product.scores[selectedMetric as keyof typeof product.scores],
        color: getCategoryColor(product.category),
        category: product.category,
        brand: product.brand
      }))
      .sort((a, b) => b.value - a.value);
  }, [products, selectedMetric]);

  const categoryData = useMemo(() => {
    if (products.length === 0) return [];
    
    const categoryMap = new Map<string, { count: number; avgPrice: number; avgScore: number }>();
    
    products.forEach(product => {
      const category = product.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, avgPrice: 0, avgScore: 0 });
      }
      
      const data = categoryMap.get(category)!;
      data.count++;
      data.avgPrice += product.price;
      data.avgScore += product.scores.overall;
    });
    
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      label: category,
      count: data.count,
      avgPrice: Math.round(data.avgPrice / data.count),
      avgScore: Math.round(data.avgScore / data.count),
      color: getCategoryColor(category)
    }));
  }, [products]);

  const brandData = useMemo(() => {
    if (products.length === 0) return [];
    
    const brandMap = new Map<string, { count: number; avgScore: number; priceRange: [number, number] }>();
    
    products.forEach(product => {
      const brand = product.brand;
      if (!brandMap.has(brand)) {
        brandMap.set(brand, { count: 0, avgScore: 0, priceRange: [Infinity, 0] });
      }
      
      const data = brandMap.get(brand)!;
      data.count++;
      data.avgScore += product.scores.overall;
      data.priceRange[0] = Math.min(data.priceRange[0], product.price);
      data.priceRange[1] = Math.max(data.priceRange[1], product.price);
    });
    
    return Array.from(brandMap.entries()).map(([brand, data]) => ({
      label: brand,
      count: data.count,
      avgScore: Math.round(data.avgScore / data.count),
      priceRange: data.priceRange[0] === Infinity ? [0, 0] : data.priceRange,
      color: getBrandColor(brand)
    }));
  }, [products]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Premium': '#3b82f6',
      'Mid-Range': '#10b981',
      'Budget': '#f59e0b',
      'Enterprise': '#8b5cf6',
      'Developer': '#ef4444',
      'Lifestyle': '#06b6d4'
    };
    return colors[category] || '#6b7280';
  };

  const getBrandColor = (brand: string) => {
    const colors: { [key: string]: string } = {
      'Xreal': '#3b82f6',
      'Viture': '#10b981',
      'Rokid': '#f59e0b',
      'RayNeo': '#8b5cf6',
      'Brilliant Labs': '#ef4444',
      'Even Realities': '#06b6d4'
    };
    return colors[brand] || '#6b7280';
  };

  const exportChart = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Simple implementation - in a real app you'd use a proper chart library
    const dataToExport = {
      metric: selectedMetric,
      chartType,
      data: chartData,
      categories: categoryData,
      brands: brandData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-visualization-${selectedMetric}-${new Date().toISOString().split('T')[0]}.json`;
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
            <div className="h-64 bg-gray-200 rounded"></div>
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
            <p>Error loading visualization data: {error}</p>
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
        {/* Header Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Data Visualizer
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map(metric => (
                      <SelectItem key={metric.value} value={metric.value}>
                        <div className="flex items-center gap-2">
                          <metric.icon className="h-4 w-4" />
                          {metric.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" onClick={exportChart}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Visualization Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Product Performance</span>
                    <Badge variant="secondary">
                      {metrics.find(m => m.value === selectedMetric)?.label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart data={chartData} height={300} />
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChartComponent data={categoryData} height={300} />
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                label="Top Performer" 
                value={chartData[0]?.label || 'N/A'}
                subtitle={`Score: ${chartData[0]?.value || 0}`}
                icon={Award}
                color="text-yellow-600"
              />
              <StatCard 
                label="Best Value" 
                value={products.find(p => p.scores.valueForMoney === Math.max(...products.map(p => p.scores.valueForMoney)))?.name || 'N/A'}
                subtitle="Value Leader"
                icon={DollarSign}
                color="text-green-600"
              />
              <StatCard 
                label="Most Innovative" 
                value={products.find(p => p.scores.innovation === Math.max(...products.map(p => p.scores.innovation)))?.name || 'N/A'}
                subtitle="Innovation Leader"
                icon={Zap}
                color="text-purple-600"
              />
              <StatCard 
                label="Price Range" 
                value={`$${Math.min(...products.map(p => p.price))}-${Math.max(...products.map(p => p.price))}`}
                subtitle="Market Spread"
                icon={Target}
                color="text-blue-600"
              />
            </div>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Multi-metric Comparison */}
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Multi-Metric Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadarChart products={products.slice(0, 4)} />
                </CardContent>
              </Card>

              {/* Price vs Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Price vs Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScatterPlot 
                    data={products.map(p => ({
                      x: p.price,
                      y: p.scores.overall,
                      label: p.name,
                      color: getCategoryColor(p.category)
                    }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Brand Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandData.map(brand => (
                    <div key={brand.label} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{brand.label}</h4>
                        <Badge variant="outline">{brand.count} products</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Avg Score:</span>
                          <span className="font-medium">{brand.avgScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price Range:</span>
                          <span className="font-medium">
                            ${brand.priceRange[0]}-${brand.priceRange[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendAnalysis products={products} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

// Chart Components
const BarChart: React.FC<{ data: ChartDataPoint[]; height: number }> = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-24 text-sm font-medium truncate" title={item.label}>
            {item.label}
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3b82f6'
                }}
              >
                <span className="text-white text-xs font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PieChartComponent: React.FC<{ data: any[]; height: number }> = ({ data, height }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="space-y-4" style={{ height }}>
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Simple pie chart representation */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-sm font-bold">{total}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="text-sm">
              <div className="font-medium">{item.label}</div>
              <div className="text-gray-500">{item.count} products</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RadarChart: React.FC<{ products: ProductData[] }> = ({ products }) => {
  const metrics = ['displayQuality', 'valueForMoney', 'buildQuality', 'innovation', 'userExperience'];
  
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-gray-600 mb-4">
        Comparing top 4 products across all metrics
      </div>
      
      {products.map((product, index) => (
        <div key={product.productId} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{product.name}</span>
            <Badge variant="outline">{product.scores.overall}</Badge>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {metrics.map(metric => (
              <div key={metric} className="text-center">
                <div className="text-xs text-gray-500 mb-1 capitalize">
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="h-16 bg-gray-200 rounded-full flex items-end justify-center p-1">
                  <div 
                    className="bg-blue-500 rounded-full w-full transition-all duration-500"
                    style={{ 
                      height: `${(product.scores[metric as keyof typeof product.scores] / 100) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                </div>
                <div className="text-xs font-medium mt-1">
                  {product.scores[metric as keyof typeof product.scores]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ScatterPlot: React.FC<{ data: Array<{ x: number; y: number; label: string; color: string }> }> = ({ data }) => {
  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  
  return (
    <div className="relative w-full h-64 border border-gray-200 rounded-lg p-4">
      <div className="absolute inset-4">
        {data.map((point, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-125 transition-transform"
                style={{
                  backgroundColor: point.color,
                  left: `${(point.x / maxX) * 100}%`,
                  bottom: `${(point.y / maxY) * 100}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">{point.label}</div>
                <div>Price: ${point.x}</div>
                <div>Score: {point.y}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        Price ($)
      </div>
      <div className="absolute top-1/2 left-1 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">
        Performance Score
      </div>
    </div>
  );
};

const TrendAnalysis: React.FC<{ products: ProductData[] }> = ({ products }) => {
  const insights = [
    {
      title: "Premium Market Dominance",
      description: "Premium products (>$500) show consistently higher innovation scores",
      metric: "Innovation vs Price correlation: +0.78"
    },
    {
      title: "Value-Performance Balance",
      description: "Mid-range products offer the best value-to-performance ratio",
      metric: "Sweet spot: $400-$600 range"
    },
    {
      title: "Display Quality Leadership",
      description: "Micro-OLED adoption drives display quality scores",
      metric: "Avg display score: 82.5/100"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  <Badge variant="outline" className="text-xs">{insight.metric}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Positioning Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Performance Leaders</h4>
              <div className="space-y-2">
                {products
                  .sort((a, b) => b.scores.overall - a.scores.overall)
                  .slice(0, 4)
                  .map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant="secondary">{product.scores.overall}</Badge>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Value Champions</h4>
              <div className="space-y-2">
                {products
                  .sort((a, b) => b.scores.valueForMoney - a.scores.valueForMoney)
                  .slice(0, 4)
                  .map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant="secondary">{product.scores.valueForMoney}</Badge>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ label, value, subtitle, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <Icon className={`h-8 w-8 ${color}`} />
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="font-semibold text-sm">{value}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MarketDataVisualizer;