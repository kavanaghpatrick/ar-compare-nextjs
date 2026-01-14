import { NextRequest, NextResponse } from 'next/server';
import { marketAnalysis } from '@/data/market-analysis';
import { getTopProducts, compareProducts, analyzeMarketPosition } from '@/lib/market-utils';
import logger from '@/lib/logger';

// Cache headers for market data (5min browser, 30min CDN)
const cacheHeaders = {
  'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const productId = searchParams.get('productId');
    const metric = searchParams.get('metric');

    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            marketInsights: marketAnalysis.marketInsights,
            topPerformers: {
              displayQuality: getTopProducts('displayQuality', 3),
              valueForMoney: getTopProducts('valueForMoney', 3),
              buildQuality: getTopProducts('buildQuality', 3),
              innovation: getTopProducts('innovation', 3)
            }
          }
        }, { headers: cacheHeaders });

      case 'competitive-matrix':
        return NextResponse.json({
          success: true,
          data: marketAnalysis.competitiveMatrix
        }, { headers: cacheHeaders });

      case 'market-segments':
        return NextResponse.json({
          success: true,
          data: marketAnalysis.marketSegments
        }, { headers: cacheHeaders });

      case 'trends':
        return NextResponse.json({
          success: true,
          data: marketAnalysis.marketTrends
        }, { headers: cacheHeaders });

      case 'buyer-personas':
        return NextResponse.json({
          success: true,
          data: marketAnalysis.buyerPersonas
        });

      case 'use-cases':
        return NextResponse.json({
          success: true,
          data: marketAnalysis.useCaseRecommendations
        });

      case 'product-analysis':
        if (!productId) {
          return NextResponse.json({
            success: false,
            error: 'Product ID is required for product analysis'
          }, { status: 400 });
        }
        
        const analysis = analyzeMarketPosition(productId);
        if (!analysis) {
          return NextResponse.json({
            success: false,
            error: 'Product not found'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          data: analysis
        });

      case 'competitive-comparison':
        const productIds = searchParams.get('products')?.split(',');
        if (!productIds || productIds.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Product IDs are required for comparison'
          }, { status: 400 });
        }
        
        const comparison = compareProducts(productIds);
        return NextResponse.json({
          success: true,
          data: comparison
        });

      case 'top-performers':
        if (!metric || !(metric in marketAnalysis.competitiveMatrix)) {
          return NextResponse.json({
            success: false,
            error: 'Valid metric is required (displayQuality, valueForMoney, buildQuality, softwareEcosystem, innovation, userExperience)'
          }, { status: 400 });
        }
        
        const count = parseInt(searchParams.get('count') || '5');
        const topPerformers = getTopProducts(metric as keyof typeof marketAnalysis.competitiveMatrix, count);
        
        return NextResponse.json({
          success: true,
          data: topPerformers
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Available types: overview, competitive-matrix, market-segments, trends, buyer-personas, use-cases, product-analysis, competitive-comparison, top-performers'
        }, { status: 400 });
    }
  } catch (error) {
    logger.error('Market insights API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'personalized-recommendation':
        const { getPersonalizedRecommendation } = await import('@/lib/market-utils');
        const recommendation = getPersonalizedRecommendation(data);
        
        if (!recommendation) {
          return NextResponse.json({
            success: false,
            error: 'No suitable products found for your requirements'
          }, { status: 404 });
        }
        
        return NextResponse.json({
          success: true,
          data: recommendation
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 });
    }
  } catch (error) {
    logger.error('Market insights POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}