import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { Product } from '@/types';

interface CompareRequest {
  productIds: string[];
}

interface ComparisonResult {
  products: Product[];
  comparison: {
    specs: {
      [key: string]: {
        [productId: string]: unknown;
      };
    };
    pros: {
      [productId: string]: string[];
    };
    cons: {
      [productId: string]: string[];
    };
    ratings: {
      [productId: string]: number;
    };
    prices: {
      [productId: string]: {
        current: number;
        original: number;
        currency: string;
      };
    };
  };
}

// POST /api/products/compare - Compare multiple products
export async function POST(request: Request) {
  try {
    const body: CompareRequest = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 product IDs are required for comparison' },
        { status: 400 }
      );
    }

    if (productIds.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 products can be compared at once' },
        { status: 400 }
      );
    }

    const products = productIds
      .map(id => arGlassesData.find(p => p.id === id))
      .filter((product): product is Product => product !== undefined);

    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      return NextResponse.json(
        { error: `Products not found: ${missingIds.join(', ')}` },
        { status: 404 }
      );
    }

    // Build comparison object
    const comparison: ComparisonResult['comparison'] = {
      specs: {},
      pros: {},
      cons: {},
      ratings: {},
      prices: {}
    };

    // Extract specifications for comparison
    const specCategories = ['display', 'design', 'audio', 'connectivity', 'features'];
    
    specCategories.forEach(category => {
      comparison.specs[category] = {};
      products.forEach(product => {
        comparison.specs[category][product.id] = product.specifications[category as keyof typeof product.specifications];
      });
    });

    // Extract pros, cons, ratings, and prices
    products.forEach(product => {
      comparison.pros[product.id] = product.pros;
      comparison.cons[product.id] = product.cons;
      comparison.ratings[product.id] = product.rating;
      comparison.prices[product.id] = {
        current: product.price,
        original: product.originalPrice || product.price,
        currency: product.currency
      };
    });

    const result: ComparisonResult = {
      products,
      comparison
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error comparing products:', error);
    return NextResponse.json(
      { error: 'Failed to compare products' },
      { status: 500 }
    );
  }
}