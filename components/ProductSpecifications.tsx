"use client";

import React, { useState } from 'react';
import { Monitor, Headphones, Wifi, Cpu, Eye, Weight, Zap, Camera, Battery, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedProduct } from '@/types';
import { cn } from '@/lib/utils';

interface ProductSpecificationsProps {
  product: EnhancedProduct;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('display');

  const getSpecIcon = (category: string) => {
    switch (category) {
      case 'display': return Monitor;
      case 'design': return Weight;
      case 'audio': return Headphones;
      case 'connectivity': return Wifi;
      case 'features': return Cpu;
      default: return Zap;
    }
  };

  const getSpecBadgeVariant = (key: string, value: string) => {
    // Highlight important specs with different colors
    if (key.toLowerCase().includes('fov') || key.toLowerCase().includes('field')) {
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
    if (key.toLowerCase().includes('weight')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (key.toLowerCase().includes('resolution')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (key.toLowerCase().includes('tracking')) {
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
    return 'bg-white/10 text-white/80 border-white/20';
  };

  const renderSpecificationSection = (title: string, specs: Record<string, any>, icon: React.ElementType) => {
    const IconComponent = icon;
    
    return (
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <IconComponent className="w-5 h-5 text-blue-400" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white/80 capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <Badge className={getSpecBadgeVariant(key, value?.toString() || '')}>
                  {value?.toString() || 'N/A'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const enhancedSpecsCategories = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Gauge,
      specs: {
        'Processing Power': product.enhancedSpecs.processingPower || product.specifications.features?.chip || 'Standard',
        'Latency': product.specifications.features?.latency || 'Not specified',
        'Refresh Rate': product.specifications.display.refreshRate,
        'Tracking Capability': product.enhancedSpecs.trackingCapability || product.specifications.features?.tracking || 'Basic',
      }
    },
    {
      id: 'display',
      label: 'Display',
      icon: Monitor,
      specs: {
        'Display Technology': product.enhancedSpecs.displayTechnology || product.specifications.display.type,
        'Resolution': product.specifications.display.resolution,
        'Field of View': product.specifications.display.fov,
        'Brightness': product.enhancedSpecs.perceivedBrightness || product.specifications.display.brightness,
        'Color Accuracy': product.specifications.display.colorAccuracy || 'Standard',
      }
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: Headphones,
      specs: {
        'Audio System': product.enhancedSpecs.audioPartnership || product.enhancedSpecs.audioSystem || product.specifications.audio.speakers,
        'Microphones': product.specifications.audio.microphones,
        'Sound Leakage': product.specifications.audio.soundLeakage || 'Standard',
        'Audio Features': product.enhancedSpecs.audioArray || 'Standard speakers',
      }
    },
    {
      id: 'design',
      label: 'Design',
      icon: Weight,
      specs: {
        'Weight': product.specifications.design.weight,
        'Material': product.enhancedSpecs.frameMaterial || product.specifications.design.material,
        'IPD Adjustment': product.enhancedSpecs.prescriptionSupport || product.specifications.design.ipdAdjustment,
        'Dimming': product.enhancedSpecs.electrochromicDimming || product.specifications.design.dimming || 'Manual',
      }
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      icon: Wifi,
      specs: {
        'Connection Type': product.specifications.connectivity.connection,
        'Compatibility Range': product.enhancedSpecs.compatibilityRange || 'Standard',
        'Supported Devices': product.specifications.connectivity.compatibility.join(', '),
        'Connectivity Options': product.enhancedSpecs.connectivityOptions || 'USB-C',
      }
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: Zap,
      specs: {
        'AI Integration': product.enhancedSpecs.aiIntegration || product.enhancedSpecs.aiCapabilities || 'None',
        'Spatial Computing': product.enhancedSpecs.spatialComputing || 'Basic',
        'Camera System': product.specifications.features?.camera || 'None',
        'Battery Life': product.enhancedSpecs.batteryLife || 'Device dependent',
        'Special Features': product.enhancedSpecs.realTime2Dto3D || product.enhancedSpecs.electrochromicFilm || 'Standard',
      }
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">
          Technical Specifications
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Comprehensive technical details and enhanced specifications based on real-world testing and Amazon research
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/5 border-white/10">
          {enhancedSpecsCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400",
                  "text-white/70 hover:text-white/90 transition-colors"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {enhancedSpecsCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {renderSpecificationSection(category.label, category.specs, category.icon)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Comparison Highlights */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            Specification Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* FOV Highlight */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {product.specifications.display.fov}
              </div>
              <div className="text-sm text-white/70">Field of View</div>
            </div>

            {/* Weight Highlight */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <Weight className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {product.specifications.design.weight}
              </div>
              <div className="text-sm text-white/70">Weight</div>
            </div>

            {/* Resolution Highlight */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {product.specifications.display.resolution}
              </div>
              <div className="text-sm text-white/70">Resolution</div>
            </div>

            {/* Tracking Highlight */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <Cpu className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {product.specifications.features?.tracking || '3 DoF'}
              </div>
              <div className="text-sm text-white/70">Tracking</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Specifications from Research */}
      {Object.keys(product.enhancedSpecs).length > 0 && (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              Enhanced Research Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {Object.entries(product.enhancedSpecs).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-white/80 capitalize font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-white text-right max-w-md">
                    {value?.toString() || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}