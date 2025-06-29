'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Award, DollarSign, Zap, Users, Target, BarChart3, Activity, Eye, Info } from 'lucide-react';
import logger from '@/lib/logger';

// Utility functions
const formatProductName = (productId: string) => {
  return productId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
};

const getScoreGradient = (score: number) => {
  if (score >= 90) return 'from-emerald-400 to-emerald-600';
  if (score >= 80) return 'from-blue-400 to-blue-600';
  if (score >= 70) return 'from-yellow-400 to-yellow-600';
  if (score >= 60) return 'from-orange-400 to-orange-600';
  return 'from-red-400 to-red-600';
};

// Enhanced Visualization Components
const ProgressBar: React.FC<{ 
  score: number; 
  label: string; 
  animated?: boolean;
  showTooltip?: boolean;
  maxScore?: number;
}> = ({ score, label, animated = true, showTooltip = true, maxScore = 100 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  const displayScore = animated ? animatedScore : score;
  const percentage = (displayScore / maxScore) * 100;

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{displayScore}/{maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-1000 ease-out rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {score}% performance score
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const BarChart: React.FC<{
  data: Array<{ name: string; value: number; color?: string }>;
  title: string;
  height?: number;
  animated?: boolean;
}> = ({ data, title, height = 200, animated = true }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const maxValue = Math.max(...data.map(d => d.value));

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(true);
    }
  }, [animated]);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <div className="relative" style={{ height: `${height}px` }}>
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            return (
              <div key={item.name} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div
                    className={`w-full bg-gradient-to-t ${item.color || getScoreGradient(item.value)} rounded-t-lg transition-all duration-1000 ease-out hover:brightness-110 cursor-pointer relative overflow-hidden`}
                    style={{
                      height: animationComplete ? `${heightPercent}%` : '0%',
                      minHeight: animationComplete ? '4px' : '0px'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 hover:bg-white/20 transition-colors"></div>
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.value}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center transform rotate-45 origin-left">
                  {formatProductName(item.name)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RadarChart: React.FC<{
  data: Array<{ category: string; score: number }>;
  size?: number;
  title: string;
}> = ({ data, size = 200, title }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (2 * Math.PI) / data.length;

  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = (item.score / 100) * radius;
    const x = center + Math.cos(angle) * value;
    const y = center + Math.sin(angle) * value;
    return { x, y, ...item };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <div className="relative">
        <svg width={size} height={size} className="mx-auto">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((ratio, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius * ratio}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="hover:fill-blue-700 cursor-pointer"
            />
          ))}

          {/* Labels */}
          {data.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const labelX = center + Math.cos(angle) * (radius + 15);
            const labelY = center + Math.sin(angle) * (radius + 15);
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {item.category}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const TrendVisualization: React.FC<{
  trends: Array<{ category: string; trend: string; impact: string; description: string }>;
}> = ({ trends }) => {
  const impactCounts = trends.reduce((acc, trend) => {
    acc[trend.impact] = (acc[trend.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(impactCounts).map(([impact, count]) => (
          <div key={impact} className="text-center p-4 rounded-lg border">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
              impact === 'high' ? 'bg-red-100 text-red-600' :
              impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-green-100 text-green-600'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-gray-600 capitalize">{impact} Impact</div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MarketInsightsProps {
  productId?: string;
  showFullAnalysis?: boolean;
  className?: string;
}

interface TopPerformer {
  productId: string;
  score: number;
  justification: string;
}

interface MarketData {
  marketInsights?: {
    topPerformers: {
      overall: string;
      valueLeader: string;
      innovationLeader: string;
      qualityLeader: string;
    };
    marketGaps: string[];
    emergingOpportunities: string[];
    competitiveLandscape: string;
  };
  topPerformers?: {
    displayQuality: TopPerformer[];
    valueForMoney: TopPerformer[];
    buildQuality: TopPerformer[];
    innovation: TopPerformer[];
  };
  trends?: Array<{
    category: string;
    trend: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    affectedProducts: string[];
  }>;
  segments?: Array<{
    name: string;
    priceRange: { min: number; max: number };
    products: string[];
    targetAudience: string[];
    keyFeatures: string[];
  }>;
  personas?: Array<{
    name: string;
    description: string;
    primaryNeeds: string[];
    budget: { min: number; max: number };
    technicalExpertise: string;
    primaryRecommendations: string[];
    considerations: string[];
  }>;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ 
  productId, 
  showFullAnalysis = false, 
  className = '' 
}) => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        // Fetch overview data
        const overviewResponse = await fetch('/api/market/insights?type=overview');
        const overviewData = await overviewResponse.json();
        
        if (overviewData.success) {
          setMarketData(prev => ({ ...prev, ...overviewData.data }));
        }

        // Fetch trends if showing full analysis
        if (showFullAnalysis) {
          const trendsResponse = await fetch('/api/market/insights?type=trends');
          const trendsData = await trendsResponse.json();
          
          if (trendsData.success) {
            setMarketData(prev => ({ ...prev, trends: trendsData.data }));
          }

          const segmentsResponse = await fetch('/api/market/insights?type=market-segments');
          const segmentsData = await segmentsResponse.json();
          
          if (segmentsData.success) {
            setMarketData(prev => ({ ...prev, segments: segmentsData.data }));
          }

          const personasResponse = await fetch('/api/market/insights?type=buyer-personas');
          const personasData = await personasResponse.json();
          
          if (personasData.success) {
            setMarketData(prev => ({ ...prev, personas: personasData.data }));
          }
        }
      } catch (err) {
        setError('Failed to load market insights');
        logger.error('Market insights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [showFullAnalysis, productId]);

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="space-y-8">
          {/* Header Loading */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Cards Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((subIndex) => (
                      <div key={subIndex} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-100 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Loading */}
          <Card className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-64 space-x-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-200 rounded-t-lg"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading market insights: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showFullAnalysis ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab marketData={marketData} />
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <CompetitiveTab marketData={marketData} />
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <SegmentsTab marketData={marketData} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendsTab marketData={marketData} />
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <PersonasTab marketData={marketData} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <OverviewTab marketData={marketData} />
        </div>
      )}
    </div>
  );
};

const OverviewTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => (
  <>
    {/* Market Leaders */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Market Leaders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Overall Leader</div>
            <div className="font-semibold text-yellow-800">
              {marketData.marketInsights?.topPerformers.overall && 
                formatProductName(marketData.marketInsights.topPerformers.overall)}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Value Leader</div>
            <div className="font-semibold text-green-800">
              {marketData.marketInsights?.topPerformers.valueLeader && 
                formatProductName(marketData.marketInsights.topPerformers.valueLeader)}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Innovation Leader</div>
            <div className="font-semibold text-blue-800">
              {marketData.marketInsights?.topPerformers.innovationLeader && 
                formatProductName(marketData.marketInsights.topPerformers.innovationLeader)}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Quality Leader</div>
            <div className="font-semibold text-purple-800">
              {marketData.marketInsights?.topPerformers.qualityLeader && 
                formatProductName(marketData.marketInsights.topPerformers.qualityLeader)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Top Performers by Category */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top Performers by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {marketData.topPerformers && Object.entries(marketData.topPerformers).map(([category, performers]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold capitalize text-lg">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="space-y-4">
                {performers.slice(0, 5).map((performer, index) => (
                  <div key={performer.productId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? 'default' : 'secondary'} className="min-w-fit">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium text-sm">{formatProductName(performer.productId)}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {performer.score}
                      </span>
                    </div>
                    <ProgressBar 
                      score={performer.score} 
                      label="" 
                      animated={true}
                      showTooltip={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Market Landscape */}
    <Card>
      <CardHeader>
        <CardTitle>Competitive Landscape</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          {marketData.marketInsights?.competitiveLandscape}
        </p>
      </CardContent>
    </Card>

    {/* Market Gaps & Opportunities */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            Market Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {marketData.marketInsights?.marketGaps.map((gap, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{gap}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Emerging Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {marketData.marketInsights?.emergingOpportunities.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{opportunity}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </>
);

const CompetitiveTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('displayQuality');
  const [viewMode, setViewMode] = useState<'list' | 'chart' | 'radar'>('chart');

  const categories = marketData.topPerformers ? Object.keys(marketData.topPerformers) : [];
  const currentData = marketData.topPerformers?.[selectedCategory as keyof typeof marketData.topPerformers] || [];

  // Prepare data for radar chart - take top 3 performers and show their scores across all categories
  const radarData = useMemo(() => {
    if (!marketData.topPerformers) return [];
    
    const topProducts = new Set(
      Object.values(marketData.topPerformers)
        .flat()
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(p => p.productId)
    );

    return Array.from(topProducts).map(productId => {
      const scores = Object.entries(marketData.topPerformers!).map(([category, performers]) => {
        const performer = performers.find(p => p.productId === productId);
        return {
          category: category.replace(/([A-Z])/g, ' $1').trim(),
          score: performer?.score || 0
        };
      });
      return { productId, scores };
    });
  }, [marketData.topPerformers]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Competitive Analysis Matrix
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-1 text-sm ${viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setViewMode('radar')}
                  className={`px-3 py-1 text-sm ${viewMode === 'radar' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  Radar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  List
                </button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'chart' && (
            <BarChart
              data={currentData.map(p => ({ 
                name: p.productId, 
                value: p.score 
              }))}
              title={`${selectedCategory.replace(/([A-Z])/g, ' $1').trim()} Performance`}
              height={300}
            />
          )}
          
          {viewMode === 'radar' && radarData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {radarData.map(({ productId, scores }) => (
                <RadarChart
                  key={productId}
                  data={scores}
                  title={formatProductName(productId)}
                  size={200}
                />
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-4">
              {currentData.map((performer, index) => (
                <div key={performer.productId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{formatProductName(performer.productId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        {performer.score}
                      </span>
                      <div className="w-16">
                        <ProgressBar 
                          score={performer.score} 
                          label="" 
                          animated={false}
                          showTooltip={false}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{performer.justification}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SegmentsTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => {
  const segmentColors = ['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600'];
  
  const priceRangeData = marketData.segments?.map((segment, index) => ({
    name: segment.name,
    min: segment.priceRange.min,
    max: segment.priceRange.max,
    average: (segment.priceRange.min + segment.priceRange.max) / 2,
    color: segmentColors[index % segmentColors.length]
  })) || [];

  return (
    <div className="space-y-8">
      {/* Price Range Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Market Segments Price Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {priceRangeData.map((segment, index) => (
                <div key={segment.name} className="text-center p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${segment.color} mb-3`}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-semibold text-lg">{segment.name}</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">
                    ${segment.min} - ${segment.max}
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg: ${Math.round(segment.average)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Range Bar Chart */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Price Range Comparison</h4>
              <div className="space-y-4">
                {priceRangeData.map((segment, index) => (
                  <div key={segment.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{segment.name}</span>
                      <span className="text-sm text-gray-600">${segment.min} - ${segment.max}</span>
                    </div>
                    <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${segment.color} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${(segment.max / Math.max(...priceRangeData.map(s => s.max))) * 100}%`,
                          marginLeft: `${(segment.min / Math.max(...priceRangeData.map(s => s.max))) * 100}%`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          ${segment.min} - ${segment.max}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketData.segments?.map((segment, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${segmentColors[index % segmentColors.length]} flex items-center justify-center`}>
                  <Target className="h-4 w-4 text-white" />
                </div>
                {segment.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm text-gray-600">
                  ${segment.priceRange.min} - ${segment.priceRange.max}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Target Audience
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {segment.targetAudience.map((audience, i) => (
                    <Badge key={i} variant="outline" className="justify-center">{audience}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Key Features
                </h5>
                <div className="space-y-2">
                  {segment.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${segmentColors[index % segmentColors.length]}`}></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Products ({segment.products.length})
                </h5>
                <div className="space-y-2">
                  {segment.products.map((productId, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">
                        {formatProductName(productId)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TrendsTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => {
  if (!marketData.trends) return null;

  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <TrendVisualization trends={marketData.trends} />
      
      {/* Trend Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Trends Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {marketData.trends.map((trend, index) => (
              <div key={index} className="relative group">
                {/* Timeline Line */}
                {index < marketData.trends!.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200 group-hover:bg-blue-200 transition-colors"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Impact Indicator */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    trend.impact === 'high' ? 'bg-red-100 text-red-600' :
                    trend.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Zap className="w-6 h-6" />
                  </div>
                  
                  {/* Trend Content */}
                  <div className="flex-1 pb-8">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{trend.trend}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getImpactColor(trend.impact)}>
                              {trend.impact} impact
                            </Badge>
                            <Badge variant="outline">{trend.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4 leading-relaxed">{trend.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-sm">Affected Products ({trend.affectedProducts.length})</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {trend.affectedProducts.map((productId, i) => (
                              <div key={i} className="p-2 bg-blue-50 rounded-lg flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs font-medium text-blue-800">
                                  {formatProductName(productId)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Trends by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Trends by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(marketData.trends.map(t => t.category))).map(category => {
              const categoryTrends = marketData.trends!.filter(t => t.category === category);
              const highImpactCount = categoryTrends.filter(t => t.impact === 'high').length;
              
              return (
                <div key={category} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{category}</h4>
                    <Badge variant="secondary">{categoryTrends.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">High Impact</span>
                      <span className="font-medium">{highImpactCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${(highImpactCount / categoryTrends.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PersonasTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => {
  const personaColors = [
    'from-purple-400 to-purple-600',
    'from-blue-400 to-blue-600', 
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600'
  ];

  const budgetData = marketData.personas?.map((persona, index) => ({
    name: persona.name,
    min: persona.budget.min,
    max: persona.budget.max,
    average: (persona.budget.min + persona.budget.max) / 2,
    color: personaColors[index % personaColors.length]
  })) || [];

  const expertiseData = marketData.personas?.reduce((acc, persona) => {
    acc[persona.technicalExpertise] = (acc[persona.technicalExpertise] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8">
      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((persona, index) => (
                <div key={persona.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{persona.name}</span>
                    <span className="text-sm text-gray-600">${persona.min} - ${persona.max}</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${persona.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${(persona.max / Math.max(...budgetData.map(p => p.max))) * 100}%`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        ${persona.average.toFixed(0)} avg
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Expertise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Technical Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expertiseData).map(([level, count], index) => (
                <div key={level} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${personaColors[index]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-sm text-gray-600">{count} persona{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Persona Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketData.personas?.map((persona, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4" style={{
            borderLeftColor: personaColors[index % personaColors.length].split(' ')[0].replace('from-', '#')
          }}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${personaColors[index % personaColors.length]} flex items-center justify-center flex-shrink-0`}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{persona.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{persona.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget & Expertise */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    ${persona.budget.min} - ${persona.budget.max}
                  </span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {persona.technicalExpertise}
                </Badge>
              </div>

              {/* Primary Needs */}
              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Primary Needs ({persona.primaryNeeds.length})
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {persona.primaryNeeds.map((need, i) => (
                    <div key={i} className="p-2 bg-blue-50 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-blue-800">{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Products */}
              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Recommended Products
                </h5>
                <div className="space-y-2">
                  {persona.primaryRecommendations.map((productId, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        {formatProductName(productId)}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        #{i + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Considerations */}
              <div>
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Key Considerations
                </h5>
                <div className="space-y-2">
                  {persona.considerations.map((consideration, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-orange-800 leading-relaxed">{consideration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketInsights;