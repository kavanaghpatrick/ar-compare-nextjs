import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://arcompare.com' 
      : 'http://localhost:3000';

    const productSitemap = new ProductSitemap(arGlassesData, siteUrl);
    const stats = productSitemap.getSitemapStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    logger.error('Error generating sitemap stats:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap stats' },
      { status: 500 }
    );
  }
}