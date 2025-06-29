'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Award, DollarSign, Zap, Users, Target, BarChart3 } from 'lucide-react';

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
        console.error('Market insights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [showFullAnalysis, productId]);

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketData.topPerformers && Object.entries(marketData.topPerformers).map(([category, performers]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <div className="space-y-2">
                {performers.slice(0, 3).map((performer, index) => (
                  <div key={performer.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{formatProductName(performer.productId)}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {performer.score}/100
                    </span>
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

const CompetitiveTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Competitive Analysis Matrix</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {marketData.topPerformers && Object.entries(marketData.topPerformers).map(([category, performers]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-lg capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="space-y-2">
              {performers.map((performer, index) => (
                <div key={performer.productId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{formatProductName(performer.productId)}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {performer.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{performer.justification}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SegmentsTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {marketData.segments?.map((segment, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {segment.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm text-gray-600">
              ${segment.priceRange.min} - ${segment.priceRange.max}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">Target Audience</h5>
            <div className="flex flex-wrap gap-2">
              {segment.targetAudience.map((audience, i) => (
                <Badge key={i} variant="outline">{audience}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">Key Features</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {segment.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium mb-2">Products</h5>
            <div className="space-y-1">
              {segment.products.map((productId, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {formatProductName(productId)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TrendsTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => (
  <div className="space-y-4">
    {marketData.trends?.map((trend, index) => (
      <Card key={index}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {trend.trend}
            </CardTitle>
            <Badge className={getImpactColor(trend.impact)}>
              {trend.impact} impact
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{trend.category}</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{trend.description}</p>
          <div>
            <h5 className="font-medium mb-2">Affected Products</h5>
            <div className="flex flex-wrap gap-2">
              {trend.affectedProducts.map((productId, i) => (
                <Badge key={i} variant="outline">
                  {formatProductName(productId)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const PersonasTab: React.FC<{ marketData: MarketData }> = ({ marketData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {marketData.personas?.map((persona, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {persona.name}
          </CardTitle>
          <p className="text-sm text-gray-600">{persona.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">
                ${persona.budget.min} - ${persona.budget.max}
              </span>
            </div>
            <Badge variant="outline">
              {persona.technicalExpertise}
            </Badge>
          </div>

          <div>
            <h5 className="font-medium mb-2">Primary Needs</h5>
            <div className="flex flex-wrap gap-2">
              {persona.primaryNeeds.map((need, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {need}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Recommended Products</h5>
            <div className="space-y-1">
              {persona.primaryRecommendations.map((productId, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {formatProductName(productId)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Key Considerations</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {persona.considerations.map((consideration, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default MarketInsights;