import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? 'https://arcompare.com' 
      : 'http://localhost:3000';

    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Main static pages
    const staticPages = [
      { url: siteUrl, priority: '1.0', changefreq: 'weekly' },
      { url: `${siteUrl}/compare`, priority: '0.9', changefreq: 'daily' },
      { url: `${siteUrl}/market-analysis`, priority: '0.95', changefreq: 'weekly' },
      { url: `${siteUrl}/blog`, priority: '0.85', changefreq: 'daily' },
      { url: `${siteUrl}/reviews`, priority: '0.75', changefreq: 'weekly' },
      { url: `${siteUrl}/search`, priority: '0.7', changefreq: 'monthly' },
      { url: `${siteUrl}/brand`, priority: '0.8', changefreq: 'weekly' },
    ];

    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating main sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate main sitemap' },
      { status: 500 }
    );
  }
}