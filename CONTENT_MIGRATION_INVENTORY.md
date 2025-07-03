# AR Compare Content Migration Inventory

## Executive Summary
This document provides a comprehensive inventory of all content in the ar-compare-nextjs project that needs to be migrated to the new site. The content is organized by type, location, and migration complexity.

---

## 1. Product Data

### Primary Product Database
- **Location**: `/data/products.ts`
- **Count**: 8 AR glasses products with full data
- **Structure**: TypeScript objects with comprehensive specifications
- **Migration Complexity**: **Medium** - Well-structured but needs validation

#### Product Data Fields:
- Basic info (id, brand, model, name, price)
- Specifications (display, design, audio, connectivity, features)
- Company information
- Pros/cons lists
- Enhanced data (Amazon info, customer insights, market context)

#### Products Included:
1. Xreal One Pro - Premium AR glasses ($599)
2. Xreal One - Mid-range AR glasses ($499)
3. Rokid AR Spatial - AI-focused AR glasses ($598)
4. Viture Pro XR - High-brightness AR glasses ($449)
5. RayNeo Air 3s - Budget AR glasses ($269)
6. RayNeo X3 Pro - Professional AR glasses ($899)
7. Even Realities G1 - Everyday smart glasses ($599)
8. Brilliant Labs Frame - Developer AR glasses ($349)

### Market Analysis Data
- **Location**: `/data/market-analysis.ts`
- **Structure**: Competitive analysis, market segments, buyer personas
- **Migration Complexity**: **Low** - Static data, easy to migrate

---

## 2. Static Content

### Blog Content
- **Location**: `/data/blog/posts.ts`
- **Count**: 5 blog posts
- **Format**: TypeScript with markdown content
- **Migration Complexity**: **Low** - Self-contained posts

#### Blog Posts:
1. "The Ultimate Guide to Choosing AR Glasses in 2024" (Featured)
2. "Xreal One Pro Review: The Future of AR Glasses?" (Featured)
3. "AR Glasses vs VR Headsets: Which Should You Choose in 2024?"
4. "Best Budget AR Glasses Under $300 in 2024"
5. "AR Glasses Privacy Concerns: What You Need to Know"

### Blog Categories
- **Location**: `/data/blog/categories.ts`
- **Count**: 5 categories (Guides, Reviews, Analysis, Privacy, Technology)
- **Migration Complexity**: **Low**

---

## 3. Images and Media Assets

### Current State
- **Placeholder Images**: All product images use `/api/placeholder/[width]/[height]`
- **Icons**: Empty `/public/icons/` directory
- **Screenshots**: Empty `/public/screenshots/` directory
- **Migration Complexity**: **High** - Need actual product images

### Required Images:
1. Product images for all 8 AR glasses
2. Blog post header images (5 posts)
3. Category images
4. App icons (192x192, 512x512)
5. Social sharing images (1200x630)
6. Brand logos

---

## 4. SEO Content

### Meta Descriptions and Titles
- **Locations**: 
  - Page components (dynamic generation)
  - Blog posts (embedded SEO objects)
  - `/public/manifest.json`
- **Migration Complexity**: **Low** - Well-structured

### Structured Data
- **Location**: Various components
- **Types**: Product, BlogPosting, Organization, BreadcrumbList
- **Migration Complexity**: **Medium** - Needs testing

### Sitemaps
- **Dynamic Generation**: `/app/sitemap.ts`
- **Includes**: Products, blog posts, static pages
- **Migration Complexity**: **Low**

---

## 5. Dynamic Content / API Endpoints

### Product APIs
- `/api/products` - List all products with filtering
- `/api/products/[id]` - Individual product details
- `/api/products/compare` - Product comparison
- **Migration Complexity**: **Medium** - Need to ensure API compatibility

### Market Insights API
- `/api/market/insights` - Market analysis data
- **Migration Complexity**: **Low**

### Sitemap APIs
- `/api/sitemaps/products`
- `/api/sitemaps/blog`
- `/api/sitemaps/images`
- **Migration Complexity**: **Low**

---

## 6. Configuration Data

### App Configuration
- **App Name**: "AR Compare"
- **Description**: "Compare the latest AR glasses and smart glasses"
- **Theme Color**: #2563eb
- **Background Color**: #ffffff

### PWA Configuration
- **Location**: `/public/manifest.json`
- **Includes**: App metadata, icons, shortcuts
- **Migration Complexity**: **Low**

### Constants
- **Location**: `/lib/constants.ts`
- **Content**: App name, routes, comparison limits
- **Migration Complexity**: **Low**

---

## 7. Component-Embedded Content

### Navigation Content
- Product categories
- Quick links
- Brand filters
- **Migration Complexity**: **Low**

### Filter Options
- Price ranges
- Brands
- Categories
- Sort options
- **Migration Complexity**: **Low**

---

## Migration Priority Matrix

### High Priority (Core Functionality)
1. Product data structure and content
2. Basic page routing
3. Product comparison functionality
4. Core API endpoints

### Medium Priority (User Experience)
1. Blog content and structure
2. SEO metadata
3. Structured data
4. Market analysis features

### Low Priority (Enhancement)
1. PWA configuration
2. Advanced filtering
3. Social sharing features
4. Analytics integration

---

## Data Validation Requirements

### Product Data
- [ ] Verify all product specifications
- [ ] Update pricing information
- [ ] Validate availability status
- [ ] Check external links (Amazon ASINs)

### Content
- [ ] Review blog post accuracy
- [ ] Update dated information
- [ ] Check for broken links
- [ ] Validate SEO metadata

### Images
- [ ] Source actual product images
- [ ] Create optimized versions
- [ ] Generate social media variants
- [ ] Implement lazy loading

---

## Migration Checklist

### Phase 1: Core Data
- [ ] Export product data to new format
- [ ] Set up product API endpoints
- [ ] Migrate comparison functionality
- [ ] Test data integrity

### Phase 2: Content
- [ ] Migrate blog posts
- [ ] Set up blog categories
- [ ] Configure SEO metadata
- [ ] Implement structured data

### Phase 3: Assets
- [ ] Source and optimize images
- [ ] Set up image CDN
- [ ] Configure responsive images
- [ ] Implement placeholder strategy

### Phase 4: Features
- [ ] Market analysis tools
- [ ] Advanced filtering
- [ ] Search functionality
- [ ] User preferences

---

## Technical Considerations

### Data Format
- Current: TypeScript objects
- Recommended: Consider JSON for portability
- Alternative: Database (PostgreSQL/MongoDB)

### Image Strategy
- Current: Placeholder API
- Recommended: CDN with optimization
- Consider: Next.js Image component

### SEO Implementation
- Current: Good foundation
- Enhance: Schema.org markup
- Add: Open Graph images

### Performance
- Current: Client-side heavy
- Optimize: Static generation where possible
- Consider: Edge caching

---

## Risk Assessment

### High Risk
- Missing product images
- Placeholder content in production
- API endpoint changes

### Medium Risk
- SEO metadata accuracy
- Content freshness
- Price data updates

### Low Risk
- Static content migration
- Configuration files
- Route structure

---

## Recommendations

1. **Immediate Actions**:
   - Source actual product images
   - Validate product data accuracy
   - Update pricing information

2. **Short Term**:
   - Implement proper image management
   - Set up content update workflow
   - Create data validation scripts

3. **Long Term**:
   - Consider CMS for content management
   - Implement automated price updates
   - Add user-generated content

---

## Appendix: File Structure Overview

```
/data/
  - products.ts (1,123 lines)
  - market-analysis.ts (601 lines)
  /blog/
    - posts.ts (489 lines)
    - categories.ts (44 lines)

/public/
  - manifest.json
  - /icons/ (empty)
  - /screenshots/ (empty)

/app/
  - Various page components with embedded content
  /api/
    - Multiple endpoints for dynamic content

/lib/
  - constants.ts
  - SEO utilities
  - Market utilities
```

---

*Generated: 2025-01-30*
*Total Content Items: ~100+ (including all product specs, blog posts, and configuration)*
*Estimated Migration Time: 2-3 weeks for full migration with proper testing*