'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Search, 
  BarChart3, 
  GitCompare, 
  Heart, 
  Download, 
  Sparkles, 
  Eye, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  Users,
  Bookmark,
  RefreshCw,
  Settings
} from 'lucide-react';

interface InteractiveFeaturesSummaryProps {
  className?: string;
}

const InteractiveFeaturesSummary: React.FC<InteractiveFeaturesSummaryProps> = ({ 
  className = '' 
}) => {
  const features = [
    {
      category: 'Data Exploration',
      icon: Filter,
      color: 'purple',
      items: [
        'Advanced filtering by price, category, features, and performance scores',
        'Real-time sorting with multiple criteria and direction control',
        'Interactive product cards with hover animations and quick actions',
        'Grid, list, and comparison view modes for different browsing preferences'
      ]
    },
    {
      category: 'Search & Discovery',
      icon: Search,
      color: 'cyan',
      items: [
        'AI-powered search suggestions based on user behavior patterns',
        'Advanced search with saved searches and search history',
        'Smart query matching with highlighted results and relevance scoring',
        'Multi-criteria filtering with live result updates'
      ]
    },
    {
      category: 'Data Visualization',
      icon: BarChart3,
      color: 'pink',
      items: [
        'Interactive charts and graphs with drill-down capabilities',
        'Real-time data visualization with multiple chart types',
        'Market trend analysis with timeline views and insights',
        'Performance metrics visualization with comparative analysis'
      ]
    },
    {
      category: 'Product Comparison',
      icon: GitCompare,
      color: 'red',
      items: [
        'Side-by-side product comparison with detailed specifications',
        'Head-to-head battle mode with winner determination',
        'Smart comparison insights and recommendations',
        'Export comparison data for external analysis'
      ]
    },
    {
      category: 'Personalization',
      icon: Heart,
      color: 'green',
      items: [
        'Bookmark and favorite system with persistent storage',
        'User preference saving for filters and search criteria',
        'Personalized recommendations based on browsing behavior',
        'Custom dashboard with saved searches and favorites'
      ]
    },
    {
      category: 'Enhanced UX',
      icon: Sparkles,
      color: 'yellow',
      items: [
        'Smooth animations and micro-interactions throughout',
        'Interactive tooltips with contextual information',
        'Expandable sections for detailed information',
        'Responsive design optimized for all device sizes'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string; icon: string } } = {
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-300', icon: 'text-purple-400' },
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', icon: 'text-cyan-400' },
      pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-300', icon: 'text-pink-400' },
      red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-300', icon: 'text-red-400' },
      green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-300', icon: 'text-green-400' },
      yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-300', icon: 'text-yellow-400' }
    };
    return colorMap[color] || colorMap.purple;
  };

  const interactiveStats = [
    { label: 'Interactive Components', value: '5', description: 'Fully interactive market analysis tools' },
    { label: 'Filter Options', value: '20+', description: 'Different ways to filter and sort data' },
    { label: 'Chart Types', value: '6', description: 'Various visualization methods available' },
    { label: 'Search Features', value: '8', description: 'Advanced search and discovery options' },
    { label: 'Comparison Modes', value: '3', description: 'Different ways to compare products' },
    { label: 'Saved States', value: '∞', description: 'Unlimited bookmarks and saved searches' }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 mb-6 mx-auto">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">Enhanced Interactive Features</span>
          </div>
          
          <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interactive Market
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analysis Platform
            </span>
          </CardTitle>
          
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience a completely reimagined market analysis platform with advanced interactivity, 
            intelligent filtering, and personalized insights that adapt to your needs.
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {interactiveStats.map((stat, index) => (
          <Card key={index} className="group border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-300 mb-2">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colors = getColorClasses(feature.color);
          
          return (
            <Card 
              key={index} 
              className={`group border ${colors.border} ${colors.bg} backdrop-blur-md hover:scale-105 transition-all duration-500 hover:shadow-xl`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div>
                    <CardTitle className={`text-xl ${colors.text}`}>
                      {feature.category}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle className={`h-4 w-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Demo Buttons */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white mb-4">
            Try Interactive Features
          </CardTitle>
          <p className="text-center text-white/70 mb-6">
            Explore the enhanced functionality available across all market analysis tools
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: Filter, label: 'Filter Data', color: 'purple' },
              { icon: Search, label: 'Smart Search', color: 'cyan' },
              { icon: BarChart3, label: 'Visualize', color: 'pink' },
              { icon: GitCompare, label: 'Compare', color: 'red' },
              { icon: Heart, label: 'Bookmark', color: 'green' },
              { icon: Download, label: 'Export', color: 'blue' },
              { icon: Settings, label: 'Customize', color: 'yellow' },
              { icon: RefreshCw, label: 'Refresh', color: 'gray' }
            ].map((action, index) => {
              const ActionIcon = action.icon;
              const colors = getColorClasses(action.color);
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`group flex flex-col items-center gap-2 h-auto py-4 border ${colors.border} ${colors.bg} hover:${colors.bg} transition-all duration-300 hover:scale-105`}
                >
                  <ActionIcon className={`h-5 w-5 ${colors.icon} group-hover:scale-110 transition-transform duration-300`} />
                  <span className={`text-xs ${colors.text}`}>{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Improvements Summary */}
      <Card className="border border-white/10 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white mb-4">
            Key Improvements
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enhanced Performance</h3>
              <p className="text-sm text-white/70">
                Optimized loading with lazy components and efficient data handling for smooth interactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">User-Centric Design</h3>
              <p className="text-sm text-white/70">
                Intuitive interfaces designed for exploration, discovery, and decision-making.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Data-Driven Insights</h3>
              <p className="text-sm text-white/70">
                Smart analytics and visualizations that reveal market patterns and opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Explore?
          </h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Navigate through the different tabs above to experience all the interactive features. 
            Each tool offers unique insights and capabilities to enhance your market analysis.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-4 py-2 text-white border-white/20">
              <Eye className="h-4 w-4 mr-2" />
              Interactive Visualization
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-white border-white/20">
              <Bookmark className="h-4 w-4 mr-2" />
              Personalized Experience
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-white border-white/20">
              <ArrowRight className="h-4 w-4 mr-2" />
              Real-time Updates
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveFeaturesSummary;