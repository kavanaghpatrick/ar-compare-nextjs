'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, 
  Briefcase, 
  Monitor, 
  Code, 
  Glasses, 
  DollarSign,
  Star,
  Check,
  X,
  ArrowRight,
  Target,
  ShoppingCart
} from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';

interface BuyingGuideProps {
  className?: string;
}

interface UseCaseRecommendation {
  useCase: string;
  icon: any;
  primaryRecommendation: {
    primary: string;
    alternatives: string[];
    reasoning: string;
    bestFor: string[];
    considerations: string[];
  };
  requirements: string[];
  dealBreakers: string[];
}

interface BuyerPersona {
  name: string;
  description: string;
  primaryNeeds: string[];
  budget: { min: number; max: number };
  technicalExpertise: string;
  primaryRecommendations: string[];
  considerations: string[];
}

const formatProductName = (productId: string) => {
  return productId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getUseCaseIcon = (useCase: string) => {
  switch (useCase.toLowerCase()) {
    case 'gaming and entertainment':
      return Gamepad2;
    case 'productivity and work':
      return Briefcase;
    case 'media consumption':
      return Monitor;
    case 'ar development and research':
      return Code;
    case 'everyday smart glasses':
      return Glasses;
    case 'budget-conscious entry':
      return DollarSign;
    default:
      return Target;
  }
};

const getExpertiseColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface BuyingGuideProps {
  id?: string;
  className?: string;
}

export function BuyingGuide({ id, className = '' }: BuyingGuideProps) {
  const [useCases, setUseCases] = useState<UseCaseRecommendation[]>([]);
  const [personas, setPersonas] = useState<BuyerPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('use-cases');
  const { addItem, isInComparison } = useComparison();

  useEffect(() => {
    const fetchBuyingData = async () => {
      try {
        const [useCasesResponse, personasResponse] = await Promise.all([
          fetch('/api/market/insights?type=use-cases'),
          fetch('/api/market/insights?type=buyer-personas')
        ]);

        const [useCasesData, personasData] = await Promise.all([
          useCasesResponse.json(),
          personasResponse.json()
        ]);

        if (useCasesData.success) {
          const useCaseArray = Object.entries(useCasesData.data).map(([key, value]: [string, any]) => ({
            ...value,
            icon: getUseCaseIcon(value.useCase)
          }));
          setUseCases(useCaseArray);
        }

        if (personasData.success) {
          setPersonas(personasData.data);
        }
      } catch (error) {
        console.error('Failed to fetch buying guide data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyingData();
  }, []);

  const handleAddToComparison = (productId: string) => {
    if (!isInComparison(productId)) {
      addItem(productId);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id={id} className={`buying-guide-section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-4">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Smart Buying Guide</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Find Your Perfect AR Glasses Match
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Not sure which AR glasses are right for you? Our expert analysis breaks down 
            recommendations by use case and buyer type to help you make the perfect choice.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="use-cases" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              By Use Case
            </TabsTrigger>
            <TabsTrigger value="personas" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              By Buyer Type
            </TabsTrigger>
          </TabsList>

          <TabsContent value="use-cases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => {
                const IconComponent = useCase.icon;
                return (
                  <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <span>{useCase.useCase}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Primary Recommendation */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Top Pick</span>
                        </div>
                        <div className="font-bold text-lg mb-2">
                          {formatProductName(useCase.primaryRecommendation.primary)}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {useCase.primaryRecommendation.reasoning}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToComparison(useCase.primaryRecommendation.primary)}
                            disabled={isInComparison(useCase.primaryRecommendation.primary)}
                          >
                            {isInComparison(useCase.primaryRecommendation.primary) ? 'Added' : 'Compare'}
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Alternatives */}
                      <div>
                        <h5 className="font-medium mb-2">Also Consider</h5>
                        <div className="space-y-2">
                          {useCase.primaryRecommendation.alternatives.map((alt, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{formatProductName(alt)}</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleAddToComparison(alt)}
                                disabled={isInComparison(alt)}
                              >
                                {isInComparison(alt) ? 'Added' : '+'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Best For */}
                      <div>
                        <h5 className="font-medium mb-2">Perfect For</h5>
                        <div className="flex flex-wrap gap-2">
                          {useCase.primaryRecommendation.bestFor.map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Deal Breakers */}
                      <div>
                        <h5 className="font-medium mb-2 text-red-700">Avoid If</h5>
                        <div className="space-y-1">
                          {useCase.dealBreakers.slice(0, 2).map((breaker, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                              <X className="h-3 w-3" />
                              <span>{breaker}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {personas.map((persona, index) => (
                <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center justify-between">
                      <span>{persona.name}</span>
                      <Badge className={getExpertiseColor(persona.technicalExpertise)}>
                        {persona.technicalExpertise}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{persona.description}</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Budget */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Budget:</span>
                      </div>
                      <span className="font-bold text-green-700">
                        ${persona.budget.min} - ${persona.budget.max}
                      </span>
                    </div>

                    {/* Primary Needs */}
                    <div>
                      <h5 className="font-medium mb-2">Key Requirements</h5>
                      <div className="flex flex-wrap gap-2">
                        {persona.primaryNeeds.slice(0, 3).map((need, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {need}
                          </Badge>
                        ))}
                        {persona.primaryNeeds.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{persona.primaryNeeds.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-medium mb-2">Recommended Products</h5>
                      <div className="space-y-2">
                        {persona.primaryRecommendations.slice(0, 2).map((productId, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {i === 0 && <Star className="h-3 w-3 text-yellow-500" />}
                              <span className="text-sm font-medium">
                                {formatProductName(productId)}
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleAddToComparison(productId)}
                              disabled={isInComparison(productId)}
                            >
                              {isInComparison(productId) ? 'Added' : 'Compare'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Considerations */}
                    <div>
                      <h5 className="font-medium mb-2">Important Considerations</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {persona.considerations.slice(0, 2).map((consideration, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button className="w-full" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        See Perfect Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still Not Sure Which AR Glasses to Choose?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our comparison tool makes it easy to see how different models stack up against each other. 
            Compare specs, prices, and reviews side-by-side.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Target className="h-5 w-5 mr-2" />
              Start Comparison Tool
            </Button>
            <Button size="lg" variant="outline">
              <Monitor className="h-5 w-5 mr-2" />
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}