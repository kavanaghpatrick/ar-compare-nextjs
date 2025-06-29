import { NextResponse } from 'next/server';
import arGlassesData from '@/data/products';
import { ProductSitemap } from '@/lib/product-sitemap';

export async function GET() {
  try {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://ar-compare.com' 
      : 'http://localhost:3000';

    const productSitemap = new ProductSitemap(arGlassesData, siteUrl);
    
    // Generate enhanced sitemap index with all current features
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Main products sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/api/sitemaps/products</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Blog sitemap (enhanced with new content)
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/api/sitemaps/blog</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Images sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/api/sitemaps/images</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Stats sitemap (for monitoring and SEO insights)
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/api/sitemaps/stats</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    xml += '</sitemapindex>';

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'noindex', // Sitemap index shouldn't be indexed directly
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap index' },
      { status: 500 }
    );
  }
}