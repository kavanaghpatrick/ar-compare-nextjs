'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, BarChart3, Search, Activity, Zap, Users, Globe, GitCompare, Filter, PieChart } from 'lucide-react';
import { NavigationSimple } from '@/components/NavigationSimple';
import { Footer } from '@/components/Footer';

// Lazy load heavy components for better performance
const MarketInsights = dynamic(() => import('@/components/MarketInsights'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading market insights...</p>
      </div>
    </div>
  ),
  ssr: false
});

const ProductRecommendationEngine = dynamic(() => import('@/components/ProductRecommendationEngine'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading recommendation engine...</p>
      </div>
    </div>
  ),
  ssr: false
});

// Lazy load new interactive components
const InteractiveMarketExplorer = dynamic(() => import('@/components/InteractiveMarketExplorer'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading market explorer...</p>
      </div>
    </div>
  ),
  ssr: false
});

const MarketDataVisualizer = dynamic(() => import('@/components/MarketDataVisualizer'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading data visualizer...</p>
      </div>
    </div>
  ),
  ssr: false
});

const AdvancedMarketSearch = dynamic(() => import('@/components/AdvancedMarketSearch'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading advanced search...</p>
      </div>
    </div>
  ),
  ssr: false
});

const EnhancedProductComparison = dynamic(() => import('@/components/EnhancedProductComparison'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading product comparison...</p>
      </div>
    </div>
  ),
  ssr: false
});

const InteractiveFeaturesSummary = dynamic(() => import('@/components/InteractiveFeaturesSummary'), {
  loading: () => (
    <div className="text-white/60 p-12 text-center">
      <div className="animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent mb-4"></div>
        <p className="text-lg">Loading features summary...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function MarketAnalysisPage() {
  return (
    <div className="app-container">
      <NavigationSimple />
      
      <main id="main-content">
      {/* Hero Section with Enhanced Design */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 animate-fade-in">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/80">Live Market Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              AR Glasses Market
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive market intelligence, competitive analysis, and personalized recommendations 
              for the AR glasses industry
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Global Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-8">

      <Tabs defaultValue="insights" className="space-y-8">
        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 max-w-5xl mx-auto">
            <TabsTrigger 
              value="insights" 
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 hover:bg-white/5"
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Insights</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger 
              value="explorer" 
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 hover:bg-white/5"
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Explorer</span>
              <span className="sm:hidden">Explore</span>
            </TabsTrigger>
            <TabsTrigger 
              value="visualizer" 
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 hover:bg-white/5"
            >
              <PieChart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Charts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 hover:bg-white/5"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Search</span>
              <span className="sm:hidden">Find</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compare" 
              className="flex items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/25 hover:bg-white/5"
            >
              <GitCompare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Compare</span>
              <span className="sm:hidden">Vs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="insights" className="space-y-8">
          {/* Enhanced Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Market Size Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-blue-700/20 backdrop-blur-md border border-blue-500/30 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-xs text-blue-400 font-semibold px-2 py-1 rounded-full bg-blue-500/20">
                    +45%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-300">Market Size</p>
                  <p className="text-3xl font-bold text-white tracking-tight">$2.1B</p>
                  <p className="text-sm text-white/70">Growing 45% YoY</p>
                </div>
              </div>
            </div>
            
            {/* Products Analyzed Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-green-600/20 to-green-700/20 backdrop-blur-md border border-green-500/30 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-green-500/20 border border-green-400/30">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-xs text-green-400 font-semibold px-2 py-1 rounded-full bg-green-500/20">
                    ACTIVE
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-300">Products Analyzed</p>
                  <p className="text-3xl font-bold text-white tracking-tight">8</p>
                  <p className="text-sm text-white/70">Leading brands</p>
                </div>
              </div>
            </div>
            
            {/* Price Range Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-purple-600/20 to-purple-700/20 backdrop-blur-md border border-purple-500/30 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-xs text-purple-400 font-semibold px-2 py-1 rounded-full bg-purple-500/20">
                    RANGE
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-300">Price Range</p>
                  <p className="text-3xl font-bold text-white tracking-tight">$269-$899</p>
                  <p className="text-sm text-white/70">All segments</p>
                </div>
              </div>
            </div>
            
            {/* Market Leader Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-orange-700/20 backdrop-blur-md border border-orange-500/30 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-400/30">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="text-xs text-orange-400 font-semibold px-2 py-1 rounded-full bg-orange-500/20">
                    #1
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-300">Market Leader</p>
                  <p className="text-3xl font-bold text-white tracking-tight">Xreal</p>
                  <p className="text-sm text-white/70">40% market share</p>
                </div>
              </div>
            </div>
          </div>

          <MarketInsights showFullAnalysis={true} />
        </TabsContent>

        {/* Interactive Market Explorer Tab */}
        <TabsContent value="explorer" className="space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 mb-6">
              <Filter className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Interactive Filtering & Sorting</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Market
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Explorer
              </span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Explore the market data with advanced filtering, sorting, and comparison tools. 
              Find products that match your specific criteria and save your favorite discoveries.
            </p>
          </div>
          
          <InteractiveMarketExplorer />
        </TabsContent>

        {/* Data Visualizer Tab */}
        <TabsContent value="visualizer" className="space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 backdrop-blur-sm border border-pink-500/20 mb-6">
              <PieChart className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-pink-300">Interactive Charts & Graphs</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Data
              <span className="block bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Visualize market trends, competitive positioning, and performance metrics through 
              interactive charts, graphs, and data visualizations.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="text-center text-white/60">
              <div className="animate-pulse">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-400 border-r-transparent mb-4"></div>
                <p className="text-lg">Loading analytics dashboard...</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Search Tab */}
        <TabsContent value="search" className="space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 mb-6">
              <Search className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Enhanced Search</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Advanced
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Search
              </span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Search through market data with advanced filters, AI suggestions, and smart matching. 
              Save searches and get personalized recommendations based on your queries.
            </p>
          </div>
          
          <AdvancedMarketSearch />
        </TabsContent>

        {/* Product Comparison Tab */}
        <TabsContent value="compare" className="space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 mb-6">
              <GitCompare className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">Side-by-Side Analysis</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Product
              <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Comparison
              </span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Compare products side-by-side with detailed specifications, performance metrics, 
              and intelligent insights to help you make informed decisions.
            </p>
          </div>
          
          <EnhancedProductComparison />
        </TabsContent>

        {/* Original Product Finder Tab (now renamed) */}
        <TabsContent value="recommendation" className="space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20 mb-6">
              <Search className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">AI-Powered Recommendations</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                AR Glasses
              </span>
            </h2>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our AI-powered recommendation engine analyzes market data and your preferences 
              to suggest the best AR glasses for your specific needs and budget.
            </p>
          </div>
          
          <ProductRecommendationEngine />
        </TabsContent>
      </Tabs>

      {/* Interactive Features Summary */}
      <div className="mt-20">
        <InteractiveFeaturesSummary />
      </div>

      {/* Enhanced Market Overview Section */}
      <div className="mt-20 space-y-12">
        <div className="relative">
          {/* Decorative line with gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          <div className="pt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Market
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Overview</span>
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Comprehensive insights into the competitive landscape, emerging trends, and future opportunities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Competitive Landscape Card */}
              <div className="group relative overflow-hidden p-8 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent backdrop-blur-xl rounded-3xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
                      <BarChart3 className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-300">Competitive Landscape</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    The AR glasses market is rapidly evolving with clear segmentation emerging. 
                    Xreal dominates with mature ecosystem and Google partnership, while newer 
                    players focus on AI innovation and specialized features.
                  </p>
                </div>
              </div>
              
              {/* Key Trends Card */}
              <div className="group relative overflow-hidden p-8 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent backdrop-blur-xl rounded-3xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/30">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-300">Key Trends</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Major trends include Micro-OLED display adoption, AI integration, 
                    expanding field of view capabilities, and focus on everyday wearability 
                    for mainstream consumer adoption.
                  </p>
                </div>
              </div>
              
              {/* Market Opportunities Card */}
              <div className="group relative overflow-hidden p-8 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent backdrop-blur-xl rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/30">
                      <Target className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-300">Market Opportunities</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Significant opportunities exist in AI-first AR experiences, social AR 
                    applications, specialized industry solutions, and AR glasses as primary 
                    computing devices replacing smartphones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Methodology Section */}
        <div className="relative">
          {/* Decorative line with gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="pt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Our
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Methodology</span>
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                Our market analysis is based on comprehensive evaluation of 8 leading AR glasses products 
                across multiple dimensions including display quality, value proposition, build quality, 
                software ecosystem, innovation, and user experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Analysis Framework */}
              <div className="group relative overflow-hidden p-8 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent backdrop-blur-xl rounded-3xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30">
                      <BarChart3 className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-cyan-300">Analysis Framework</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Competitive matrix scoring (0-100 scale)</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Market segmentation analysis</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Use case mapping and optimization</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Buyer persona development</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Trend impact assessment</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <span>Value proposition analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Data Sources */}
              <div className="group relative overflow-hidden p-8 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent backdrop-blur-xl rounded-3xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">
                      <Target className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-300">Data Sources</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>Product specifications and pricing</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>Company financials and market position</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>Industry reports and analyst insights</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>User reviews and feedback analysis</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>Technology trend monitoring</span>
                    </li>
                    <li className="flex items-start gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                      <span>Competitive intelligence gathering</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}