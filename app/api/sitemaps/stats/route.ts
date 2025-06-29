import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';

export async function GET() {
  try {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ar-compare.com' 
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
    console.error('Error generating sitemap stats:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap stats' },
      { status: 500 }
    );
  }
}