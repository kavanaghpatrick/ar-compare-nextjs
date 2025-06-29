import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';

export async function GET() {
  try {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://arcompare.com' 
      : 'http://localhost:3000';

    const productSitemap = new ProductSitemap(arGlassesData, siteUrl);
    const xmlContent = productSitemap.generateXMLSitemap();

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate products sitemap' },
      { status: 500 }
    );
  }
}