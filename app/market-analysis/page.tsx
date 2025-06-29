import { Metadata } from 'next';
import MarketInsights from '@/components/MarketInsights';
import ProductRecommendationEngine from '@/components/ProductRecommendationEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, BarChart3, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AR Glasses Market Analysis - Comprehensive Industry Insights',
  description: 'In-depth market analysis of AR glasses industry including competitive landscape, market segments, trends, and personalized product recommendations.',
  keywords: [
    'AR glasses market analysis',
    'AR glasses comparison',
    'AR market trends',
    'AR glasses competitive analysis',
    'AR market segments',
    'AR glasses recommendations'
  ],
  openGraph: {
    title: 'AR Glasses Market Analysis - Industry Insights & Trends',
    description: 'Comprehensive market analysis and competitive intelligence for the AR glasses industry',
    type: 'website',
  },
};

export default function MarketAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AR Glasses Market Analysis</h1>
        <p className="text-xl text-gray-600 mb-6">
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
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect AR Glasses</h2>
            <p className="text-gray-600">
              Our AI-powered recommendation engine analyzes market data and your preferences 
              to suggest the best AR glasses for your specific needs and budget.
            </p>
          </div>
          
          <ProductRecommendationEngine />
        </TabsContent>
      </Tabs>

      {/* Market Overview Section */}
      <div className="mt-12 space-y-8">
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-900">Competitive Landscape</h3>
              <p className="text-sm text-blue-800">
                The AR glasses market is rapidly evolving with clear segmentation emerging. 
                Xreal dominates with mature ecosystem and Google partnership, while newer 
                players focus on AI innovation and specialized features.
              </p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-green-900">Key Trends</h3>
              <p className="text-sm text-green-800">
                Major trends include Micro-OLED display adoption, AI integration, 
                expanding field of view capabilities, and focus on everyday wearability 
                for mainstream consumer adoption.
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-900">Market Opportunities</h3>
              <p className="text-sm text-purple-800">
                Significant opportunities exist in AI-first AR experiences, social AR 
                applications, specialized industry solutions, and AR glasses as primary 
                computing devices replacing smartphones.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Methodology</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Our market analysis is based on comprehensive evaluation of 8 leading AR glasses products 
              across multiple dimensions including display quality, value proposition, build quality, 
              software ecosystem, innovation, and user experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="font-semibold mb-3">Analysis Framework</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Competitive matrix scoring (0-100 scale)</li>
                  <li>• Market segmentation analysis</li>
                  <li>• Use case mapping and optimization</li>
                  <li>• Buyer persona development</li>
                  <li>• Trend impact assessment</li>
                  <li>• Value proposition analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Data Sources</h3>
                <ul className="space-y-2 text-sm text-gray-600">
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
  );
}