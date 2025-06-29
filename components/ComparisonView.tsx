'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ComparisonViewProps {
  products: Product[];
}

export function ComparisonView({ products }: ComparisonViewProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products selected for comparison</p>
      </div>
    );
  }

  const allSpecs = ['display', 'design', 'audio', 'connectivity', 'features'];
  
  const getSpecValue = (product: Product, category: string, key: string) => {
    const spec = product.specifications[category as keyof typeof product.specifications];
    if (spec && typeof spec === 'object') {
      const value = (spec as Record<string, unknown>)[key];
      if (value === null || value === undefined) return null;
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    }
    return spec ? String(spec) : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Price
            </td>
            {products.map((product) => (
              <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(product.price)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Category
            </td>
            {products.map((product) => (
              <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.category}
              </td>
            ))}
          </tr>
          {allSpecs.flatMap((specCategory) => {
            const firstProduct = products[0];
            if (!firstProduct) return [];
            
            const specData = firstProduct.specifications[specCategory as keyof typeof firstProduct.specifications];
            if (!specData || typeof specData !== 'object') return [];
            
            return Object.keys(specData).map((specKey) => (
              <tr key={`${specCategory}-${specKey}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {specCategory.charAt(0).toUpperCase() + specCategory.slice(1)} - {specKey}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSpecValue(product, specCategory, specKey) || '-'}
                  </td>
                ))}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}