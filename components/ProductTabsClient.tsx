'use client';

import { useState } from 'react';
import { Monitor, Lightbulb, ShoppingCart, Building2 } from 'lucide-react';
import { EnhancedProduct, TabType } from '@/types';
import { ProductSpecifications } from './ProductSpecifications';
import { ProductInsights } from './ProductInsights';
import { ProductPurchasing } from './ProductPurchasing';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ProductTabsClientProps {
  product: EnhancedProduct;
}

type ExtendedTabType = TabType | 'purchasing';

export default function ProductTabsClient({ product }: ProductTabsClientProps) {
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('specs');

  const tabs = [
    {
      id: 'specs' as ExtendedTabType,
      label: 'Specifications',
      icon: Monitor,
      description: 'Technical details and performance specs'
    },
    {
      id: 'features' as ExtendedTabType,
      label: 'Insights & Analysis',
      icon: Lightbulb,
      description: 'Customer feedback and market insights'
    },
    {
      id: 'purchasing' as ExtendedTabType,
      label: 'Purchase Options',
      icon: ShoppingCart,
      description: 'Pricing, availability, and buying guide'
    },
    {
      id: 'company' as ExtendedTabType,
      label: 'Company Info',
      icon: Building2,
      description: 'Brand background and market position'
    }
  ];

  const handlePurchaseClick = (source: string) => {
    // In a real app, this would handle purchase tracking and redirection
    console.log(`Purchase clicked for ${product.name} from ${source}`);
    
    if (source === 'amazon' && product.amazon?.asin) {
      // Open Amazon page in new tab
      window.open(`https://amazon.com/dp/${product.amazon.asin}`, '_blank');
    } else if (source === 'direct') {
      // Handle direct purchase or redirect to brand website
      window.open(`https://www.${product.brand.toLowerCase()}.com`, '_blank');
    }
  };

  const handleAddToCompare = () => {
    // In a real app, this would add to comparison cart
    console.log(`Added ${product.name} to comparison`);
  };

  return (
    <div className="w-full">
      {/* Enhanced Tab Navigation */}
      <div className="border-b border-white/10 mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-all whitespace-nowrap",
                  "hover:text-white hover:border-white/30",
                  activeTab === tab.id
                    ? "text-white border-blue-400 bg-white/5"
                    : "text-white/70"
                )}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs text-white/50 hidden sm:block">
                    {tab.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'specs' && (
          <ProductSpecifications product={product} />
        )}

        {activeTab === 'features' && (
          <ProductInsights product={product} />
        )}

        {activeTab === 'purchasing' && (
          <ProductPurchasing 
            product={product} 
            onPurchaseClick={handlePurchaseClick}
          />
        )}

        {activeTab === 'company' && (
          <div className="space-y-6">
            {/* Company Information */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  About {product.brand}
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  {product.companyInfo.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white mb-2">
                    {product.companyInfo.founded}
                  </div>
                  <div className="text-sm text-white/70">Founded</div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white mb-2">
                    {product.companyInfo.employees}
                  </div>
                  <div className="text-sm text-white/70">Employees</div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white mb-2">
                    {product.companyInfo.marketShare}
                  </div>
                  <div className="text-sm text-white/70">Market Share</div>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white mb-2">
                    {product.companyInfo.headquarters}
                  </div>
                  <div className="text-sm text-white/70">Headquarters</div>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            {product.marketContext && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-6">Market Analysis</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Market Position</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {product.marketContext.pricePositioning}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Target Audience</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {product.marketContext.targetAudience}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Competitive Advantage</h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {product.marketContext.competitiveAdvantage}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Primary Use Cases</h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        {product.marketContext.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}