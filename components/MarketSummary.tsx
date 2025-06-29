'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, TrendingUp, Users, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface MarketSummaryProps {
  className?: string;
}

interface MarketData {
  topPerformers: {
    overall: string;
    valueLeader: string;
    innovationLeader: string;
    qualityLeader: string;
  };
  keyTrends: Array<{
    trend: string;
    impact: string;
    description: string;
  }>;
  marketGaps: string[];
  competitiveLandscape: string;
}

const formatProductName = (productId: string) => {
  return productId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function MarketSummary({ className = '' }: MarketSummaryProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [overviewResponse, trendsResponse] = await Promise.all([
          fetch('/api/market/insights?type=overview'),
          fetch('/api/market/insights?type=trends')
        ]);

        const [overviewData, trendsData] = await Promise.all([
          overviewResponse.json(),
          trendsResponse.json()
        ]);

        if (overviewData.success && trendsData.success) {
          setMarketData({
            topPerformers: overviewData.data.marketInsights.topPerformers,
            keyTrends: trendsData.data.slice(0, 3), // Top 3 trends
            marketGaps: overviewData.data.marketInsights.marketGaps.slice(0, 4),
            competitiveLandscape: overviewData.data.marketInsights.competitiveLandscape
          });
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  return (
    <section className={`market-summary-section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Executive Summary Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Market Intelligence</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            AR Glasses Market at a Glance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get the essential market insights you need to make an informed purchase decision. 
            Our analysis covers 15+ products across all price segments.
          </p>
        </div>

        {/* Key Market Leaders */}
        <Card className="mb-6 border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3">
              <Award className="h-6 w-6 text-blue-600" />
              <span>Market Leaders - What You Need to Know</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-gray-600 mb-1">🏆 Overall Champion</div>
                <div className="font-bold text-lg text-gray-900">
                  {formatProductName(marketData.topPerformers.overall)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Best all-around choice</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-gray-600 mb-1">💰 Best Value</div>
                <div className="font-bold text-lg text-gray-900">
                  {formatProductName(marketData.topPerformers.valueLeader)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Most bang for buck</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-gray-600 mb-1">🚀 Most Innovative</div>
                <div className="font-bold text-lg text-gray-900">
                  {formatProductName(marketData.topPerformers.innovationLeader)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Cutting-edge features</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-gray-600 mb-1">⭐ Premium Quality</div>
                <div className="font-bold text-lg text-gray-900">
                  {formatProductName(marketData.topPerformers.qualityLeader)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Superior build & display</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                Compare Top 3
              </Button>
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Find My Match
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Key Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Key Trends 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.keyTrends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Badge 
                      variant={trend.impact === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {trend.impact}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{trend.trend}</div>
                      <div className="text-xs text-gray-600 mt-1">{trend.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Market Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {marketData.marketGaps.map((gap, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{gap}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Market Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Products Analyzed</span>
                  <span className="font-bold text-blue-600">15+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price Range</span>
                  <span className="font-bold">$269 - $899</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Top Use Case</span>
                  <span className="font-bold">Gaming</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Value Segment</span>
                  <span className="font-bold">$400-550</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expandable Market Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Market Analysis Summary</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600"
              >
                {expanded ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read Full Analysis <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {expanded 
                ? marketData.competitiveLandscape
                : `${marketData.competitiveLandscape.substring(0, 200)}...`
              }
            </p>
            {!expanded && (
              <div className="mt-4 flex gap-3">
                <Button size="sm" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  See Buyer Personas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}