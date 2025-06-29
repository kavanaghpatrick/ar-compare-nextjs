'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, BarChart3, Search } from 'lucide-react';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';

// Lazy load heavy components for better performance
const MarketInsights = dynamic(() => import('@/components/MarketInsights'), {
  loading: () => <div className="text-white/60 p-8 text-center">Loading market insights...</div>,
  ssr: false
});

const ProductRecommendationEngine = dynamic(() => import('@/components/ProductRecommendationEngine'), {
  loading: () => <div className="text-white/60 p-8 text-center">Loading recommendation engine...</div>,
  ssr: false
});

export default function MarketAnalysisPage() {
  return (
    <div className="app-container">
      <NavigationSimple />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">AR Glasses Market Analysis</h1>
          <p className="text-xl text-white/80 mb-6">
            Comprehensive market intelligence, competitive analysis, and personalized recommendations 
            for the AR glasses industry
          </p>
        </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Market Insights
          </TabsTrigger>
          <TabsTrigger value="recommendation" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Product Finder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Market Size</span>
              </div>
              <div className="text-2xl font-bold">$2.1B</div>
              <div className="text-sm opacity-75">Growing 45% YoY</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Products Analyzed</span>
              </div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-75">Leading brands</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Price Range</span>
              </div>
              <div className="text-2xl font-bold">$269-$899</div>
              <div className="text-sm opacity-75">All segments</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Market Leader</span>
              </div>
              <div className="text-2xl font-bold">Xreal</div>
              <div className="text-sm opacity-75">40% market share</div>
            </div>
          </div>

          <MarketInsights showFullAnalysis={true} />
        </TabsContent>

        <TabsContent value="recommendation" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">Find Your Perfect AR Glasses</h2>
            <p className="text-white/80">
              Our AI-powered recommendation engine analyzes market data and your preferences 
              to suggest the best AR glasses for your specific needs and budget.
            </p>
          </div>
          
          <ProductRecommendationEngine />
        </TabsContent>
      </Tabs>

      {/* Market Overview Section */}
      <div className="mt-12 space-y-8">
        <div className="border-t border-white/20 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-500/10 backdrop-blur-md rounded-lg border border-blue-500/20">
              <h3 className="font-semibold mb-2 text-blue-400">Competitive Landscape</h3>
              <p className="text-sm text-white/80">
                The AR glasses market is rapidly evolving with clear segmentation emerging. 
                Xreal dominates with mature ecosystem and Google partnership, while newer 
                players focus on AI innovation and specialized features.
              </p>
            </div>
            
            <div className="p-6 bg-green-500/10 backdrop-blur-md rounded-lg border border-green-500/20">
              <h3 className="font-semibold mb-2 text-green-400">Key Trends</h3>
              <p className="text-sm text-white/80">
                Major trends include Micro-OLED display adoption, AI integration, 
                expanding field of view capabilities, and focus on everyday wearability 
                for mainstream consumer adoption.
              </p>
            </div>
            
            <div className="p-6 bg-purple-500/10 backdrop-blur-md rounded-lg border border-purple-500/20">
              <h3 className="font-semibold mb-2 text-purple-400">Market Opportunities</h3>
              <p className="text-sm text-white/80">
                Significant opportunities exist in AI-first AR experiences, social AR 
                applications, specialized industry solutions, and AR glasses as primary 
                computing devices replacing smartphones.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Methodology</h2>
          <div className="prose max-w-none">
            <p className="text-white/80 mb-4">
              Our market analysis is based on comprehensive evaluation of 8 leading AR glasses products 
              across multiple dimensions including display quality, value proposition, build quality, 
              software ecosystem, innovation, and user experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="font-semibold mb-3 text-white">Analysis Framework</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Competitive matrix scoring (0-100 scale)</li>
                  <li>• Market segmentation analysis</li>
                  <li>• Use case mapping and optimization</li>
                  <li>• Buyer persona development</li>
                  <li>• Trend impact assessment</li>
                  <li>• Value proposition analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-white">Data Sources</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Product specifications and pricing</li>
                  <li>• Company financials and market position</li>
                  <li>• Industry reports and analyst insights</li>
                  <li>• User reviews and feedback analysis</li>
                  <li>• Technology trend monitoring</li>
                  <li>• Competitive intelligence gathering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}