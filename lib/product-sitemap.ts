import { EnhancedProduct } from '@/types';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface ImageSitemapEntry {
  url: string;
  images: {
    url: string;
    caption?: string;
    title?: string;
    geoLocation?: string;
    license?: string;
  }[];
}

export class ProductSitemap {
  private baseUrl: string;
  private products: EnhancedProduct[];

  constructor(products: EnhancedProduct[], baseUrl = 'https://ar-compare.com') {
    this.products = products;
    this.baseUrl = baseUrl;
  }

  /**
   * Calculate priority score based on product characteristics
   */
  private calculatePriority(product: EnhancedProduct): number {
    let priority = 0.5; // Base priority

    // Boost for availability
    if (product.availability === 'Available') priority += 0.2;
    else if (product.availability === 'Pre-order') priority += 0.1;

    // Boost for rating
    priority += (product.rating - 3) * 0.1; // Scale 3-5 rating to 0-0.2 boost

    // Boost for category
    switch (product.category) {
      case 'Premium': priority += 0.2; break;
      case 'Mid-range': priority += 0.1; break;
      case 'Budget': priority += 0.05; break;
      default: break;
    }

    // Boost for market share (company popularity)
    const marketShare = parseFloat(product.companyInfo.marketShare.replace('%', ''));
    if (marketShare >= 30) priority += 0.1;
    else if (marketShare >= 10) priority += 0.05;

    // Boost for review count (if from Amazon data)
    if (product.amazon?.reviewCount) {
      const reviewCount = parseInt(product.amazon.reviewCount.replace(/[^0-9]/g, '')) || 0;
      if (reviewCount >= 1000) priority += 0.1;
      else if (reviewCount >= 500) priority += 0.05;
    }

    // Boost for enhanced data completeness
    if (product.customerInsights && product.marketContext && product.purchaseRecommendation) {
      priority += 0.1;
    }

    // Cap at 1.0
    return Math.min(priority, 1.0);
  }

  /**
   * Determine last modified date based on product data freshness
   */
  private getLastModified(product: EnhancedProduct): Date {
    const now = new Date();
    
    // If product is pre-order, mark as recently updated
    if (product.availability === 'Pre-order') {
      return new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
    }

    // If product has enhanced data, mark as recently updated
    if (product.customerInsights || product.marketContext) {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Week ago
    }

    // Default based on release year
    const releaseYear = parseInt(product.releaseDate);
    if (releaseYear >= 2024) {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Month ago
    } else {
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 3 months ago
    }
  }

  /**
   * Determine change frequency based on product characteristics
   */
  private getChangeFrequency(product: EnhancedProduct): SitemapEntry['changeFrequency'] {
    // Pre-order products change frequently due to updates
    if (product.availability === 'Pre-order') return 'weekly';
    
    // Premium products with active development
    if (product.category === 'Premium') return 'monthly';
    
    // Budget products change less frequently
    if (product.category === 'Budget') return 'monthly';
    
    // Default for mid-range
    return 'monthly';
  }

  /**
   * Generate main sitemap entries for products
   */
  generateProductSitemap(): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    // Add individual product pages
    this.products.forEach(product => {
      entries.push({
        url: `${this.baseUrl}/products/${product.id}`,
        lastModified: this.getLastModified(product),
        changeFrequency: this.getChangeFrequency(product),
        priority: this.calculatePriority(product)
      });
    });

    // Add category pages
    const categories = [...new Set(this.products.map(p => p.category))];
    categories.forEach(category => {
      const categoryProducts = this.products.filter(p => p.category === category);
      const avgPriority = categoryProducts.reduce((sum, p) =>sum + this.calculatePriority(p), 0) / categoryProducts.length;
      
      entries.push({
        url: `${this.baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: Math.min(avgPriority + 0.1, 0.9)
      });
    });

    // Add brand pages
    const brands = [...new Set(this.products.map(p => p.brand))];
    brands.forEach(brand => {
      const brandProducts = this.products.filter(p => p.brand === brand);
      const avgPriority = brandProducts.reduce((sum, p) => sum + this.calculatePriority(p), 0) / brandProducts.length;
      
      entries.push({
        url: `${this.baseUrl}/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: Math.min(avgPriority + 0.1, 0.9)
      });
    });

    // Add comparison page
    entries.push({
      url: `${this.baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    });

    // Add market analysis page
    entries.push({
      url: `${this.baseUrl}/market-analysis`,
      lastModified: new Date(),
      changeFrequency: 'weekly', 
      priority: 0.7
    });

    // Sort by priority (highest first)
    return entries.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate image sitemap entries
   */
  generateImageSitemap(): ImageSitemapEntry[] {
    return this.products.map(product => ({
      url: `${this.baseUrl}/products/${product.id}`,
      images: [
        {
          url: product.image,
          caption: `${product.name} - ${product.brand} AR Glasses`,
          title: product.name,
          geoLocation: product.companyInfo.headquarters
        },
        // Add additional product images if available
        ...(product.imageUrl && product.imageUrl !== product.image ? [{
          url: product.imageUrl,
          caption: `${product.name} product view`,
          title: `${product.name} - Alternative View`
        }] : [])
      ]
    }));
  }

  /**
   * Generate mobile-specific sitemap optimizations
   */
  generateMobileSitemap(): SitemapEntry[] {
    return this.generateProductSitemap().map(entry => ({
      ...entry,
      // Mobile pages might be updated more frequently due to responsive optimizations
      changeFrequency: entry.changeFrequency === 'monthly' ? 'weekly' : entry.changeFrequency,
      // Boost mobile priority slightly for mobile-first indexing
      priority: Math.min(entry.priority + 0.05, 1.0)
    }));
  }

  /**
   * Generate XML sitemap string
   */
  generateXMLSitemap(): string {
    const entries = this.generateProductSitemap();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate XML image sitemap string
   */
  generateXMLImageSitemap(): string {
    const entries = this.generateImageSitemap();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      
      entry.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${image.url}</image:loc>\n`;
        if (image.caption) xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
        if (image.title) xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
        if (image.geoLocation) xml += `      <image:geo_location>${this.escapeXml(image.geoLocation)}</image:geo_location>\n`;
        xml += '    </image:image>\n';
      });
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  generateSitemapIndex(): string {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Main products sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemaps/products.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Images sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemaps/images.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Mobile sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemaps/mobile.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Get sitemap statistics for monitoring
   */
  getSitemapStats() {
    const entries = this.generateProductSitemap();
    const imageEntries = this.generateImageSitemap();
    
    return {
      totalUrls: entries.length,
      totalImages: imageEntries.reduce((sum, entry) => sum + entry.images.length, 0),
      averagePriority: entries.reduce((sum, entry) => sum + entry.priority, 0) / entries.length,
      highPriorityUrls: entries.filter(entry => entry.priority >= 0.8).length,
      changeFrequencies: entries.reduce((acc, entry) => {
        acc[entry.changeFrequency] = (acc[entry.changeFrequency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      lastGenerated: new Date()
    };
  }
}