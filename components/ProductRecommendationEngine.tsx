'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { Search, Zap, DollarSign, Star, Target } from 'lucide-react';

interface UserRequirements {
  budget: number;
  primaryUseCase: string;
  technicalExpertise: 'beginner' | 'intermediate' | 'advanced';
  priorities: ('price' | 'display' | 'audio' | 'features' | 'build')[];
}

interface RecommendationResult {
  primary: Product;
  alternatives: Product[];
  reasoning: string;
}

const useCases = [
  { value: 'gaming', label: 'Gaming and Entertainment' },
  { value: 'productivity', label: 'Productivity and Work' },
  { value: 'entertainment', label: 'Media Consumption' },
  { value: 'development', label: 'AR Development' },
  { value: 'everyday', label: 'Everyday Smart Glasses' },
  { value: 'budget', label: 'Budget-Conscious Entry' }
];

const priorities = [
  { value: 'price', label: 'Value for Money', icon: DollarSign },
  { value: 'display', label: 'Display Quality', icon: Target },
  { value: 'audio', label: 'Audio Quality', icon: Zap },
  { value: 'features', label: 'Software Features', icon: Star },
  { value: 'build', label: 'Build Quality', icon: Target }
];

const ProductRecommendationEngine: React.FC = () => {
  const [requirements, setRequirements] = useState<UserRequirements>({
    budget: 600,
    primaryUseCase: '',
    technicalExpertise: 'intermediate',
    priorities: []
  });
  
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setRequirements(prev => ({
      ...prev,
      priorities: checked
        ? [...prev.priorities, priority as any]
        : prev.priorities.filter(p => p !== priority)
    }));
  };

  const getRecommendation = async () => {
    if (!requirements.primaryUseCase) {
      setError('Please select a primary use case');
      return;
    }

    if (requirements.priorities.length === 0) {
      setError('Please select at least one priority');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/market/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'personalized-recommendation',
          data: requirements
        })
      });

      const result = await response.json();

      if (result.success) {
        setRecommendation(result.data);
      } else {
        setError(result.error || 'Failed to get recommendation');
      }
    } catch (err) {
      setError('Failed to connect to recommendation service');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRequirements({
      budget: 600,
      primaryUseCase: '',
      technicalExpertise: 'intermediate',
      priorities: []
    });
    setRecommendation(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Perfect AR Glasses
          </CardTitle>
          <p className="text-gray-600">
            Answer a few questions to get personalized product recommendations based on market analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Budget: ${requirements.budget}
            </label>
            <Slider
              value={[requirements.budget]}
              onValueChange={(value) => setRequirements(prev => ({ ...prev, budget: value[0] }))}
              max={1200}
              min={200}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$200</span>
              <span>$600</span>
              <span>$1200</span>
            </div>
          </div>

          {/* Use Case Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Primary Use Case</label>
            <Select 
              value={requirements.primaryUseCase} 
              onValueChange={(value) => setRequirements(prev => ({ ...prev, primaryUseCase: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your primary use case" />
              </SelectTrigger>
              <SelectContent>
                {useCases.map((useCase) => (
                  <SelectItem key={useCase.value} value={useCase.value}>
                    {useCase.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Technical Expertise */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Technical Expertise</label>
            <Select 
              value={requirements.technicalExpertise} 
              onValueChange={(value: any) => setRequirements(prev => ({ ...prev, technicalExpertise: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - I want something simple</SelectItem>
                <SelectItem value="intermediate">Intermediate - I'm comfortable with tech</SelectItem>
                <SelectItem value="advanced">Advanced - I love cutting-edge features</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priorities */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              What matters most to you? (Select at least one)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {priorities.map((priority) => {
                const Icon = priority.icon;
                return (
                  <div key={priority.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={priority.value}
                      checked={requirements.priorities.includes(priority.value as any)}
                      onCheckedChange={(checked) => 
                        handlePriorityChange(priority.value, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={priority.value}
                      className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {priority.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={getRecommendation} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Analyzing...' : 'Get Recommendation'}
            </Button>
            <Button 
              onClick={resetForm} 
              variant="outline"
            >
              Reset
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendation Results */}
      {recommendation && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Your Perfect Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <ProductCard product={recommendation.primary} />
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2">Why we recommend this:</h4>
                <p className="text-sm text-gray-700">{recommendation.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {recommendation.alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Alternative Options</CardTitle>
                <p className="text-gray-600">
                  These products also match your requirements well
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendation.alternatives.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Your Requirements Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Budget</div>
                  <div className="font-semibold">${requirements.budget}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Use Case</div>
                  <div className="font-semibold text-xs">
                    {useCases.find(uc => uc.value === requirements.primaryUseCase)?.label}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Experience</div>
                  <div className="font-semibold capitalize">{requirements.technicalExpertise}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Priorities</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {requirements.priorities.map((priority) => (
                      <Badge key={priority} variant="secondary" className="text-xs">
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationEngine;