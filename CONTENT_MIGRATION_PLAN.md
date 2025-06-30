# Content Migration Plan for AR Compare Rebuild

## Overview

This plan addresses the migration of all existing content from the current site to the new Tailwind-based rebuild. Based on the content audit, we have identified all assets and created a migration strategy.

## Content Inventory Summary

### 1. Product Data (Priority: CRITICAL)
**Location**: `/data/products.ts`  
**Count**: 8 products  
**Status**: Well-structured, ready for migration

**Products**:
1. Apple Vision Pro ($3499)
2. Meta Quest 3 ($499)
3. Meta Quest Pro ($1499)
4. Bigscreen Beyond ($999)
5. Lynx R-1 ($699)
6. RayNeo Air 3s ($269)
7. Lightship A2 ($599)
8. RayNeo X3 Pro ($899)

**Migration Strategy**:
- Direct copy of `/data/products.ts` to new project
- Validate all TypeScript types match new structure
- Update any deprecated fields

### 2. Images & Media (Priority: CRITICAL - BLOCKED)
**Current State**: ALL images using placeholder API (`/api/placeholder/`)  
**Required Action**: Source actual product images before launch

**Image Requirements**:
```
Per Product:
- Main product image (800x600)
- Gallery images (3-5 per product)
- Thumbnail (400x300)
- Comparison chart icon (100x100)

Total Needed: ~50-60 images
```

**Migration Strategy**:
```typescript
// Temporary solution for development
const PLACEHOLDER_BASE = 'https://via.placeholder.com'

// Production solution needed
const IMAGE_CDN = process.env.NEXT_PUBLIC_IMAGE_CDN || PLACEHOLDER_BASE

// Update product data with real image URLs
products.map(product => ({
  ...product,
  image: `${IMAGE_CDN}/products/${product.id}/main.jpg`,
  gallery: [
    `${IMAGE_CDN}/products/${product.id}/gallery-1.jpg`,
    `${IMAGE_CDN}/products/${product.id}/gallery-2.jpg`,
  ]
}))
```

### 3. Blog Content (Priority: MEDIUM)
**Location**: `/data/blog.ts`  
**Count**: 5 posts, 5 categories

**Posts**:
1. "Apple Vision Pro vs Meta Quest 3: Ultimate Comparison Guide"
2. "Understanding Augmented Reality: A Comprehensive Guide for 2025"
3. "2025 AR/VR Market Analysis: Industry Trends and Future Outlook"
4. "Top 10 AR Glasses of 2025: Expert Reviews and Recommendations"
5. "AR in Healthcare: Revolutionary Applications Transforming Medicine"

**Migration Strategy**:
- Copy blog data structure
- Update dates if stale
- Verify all links still work
- Consider converting to MDX for better formatting

### 4. Market Analysis Data (Priority: LOW)
**Location**: `/data/market-analysis.ts`  
**Content**: Competitive matrices, market insights, buyer personas

**Migration Strategy**:
- Direct copy to new project
- Update any outdated market data
- Consider visual refresh of data presentation

### 5. Configuration & Constants (Priority: HIGH)
**Locations**: 
- `/lib/config.ts`
- `/public/manifest.json`
- Various metadata throughout pages

**Key Configurations**:
```typescript
export const APP_CONFIG = {
  name: 'AR Compare',
  description: 'Compare AR glasses and smart glasses',
  url: 'https://arcompare.com',
  themeColor: '#2563eb',
}
```

**Migration Strategy**:
- Update all configurations to match new design
- Ensure consistent branding
- Update theme colors to match Tailwind config

## Migration Phases

### Phase 1: Data Layer (Agent 1 - Hour 0-1)
```bash
# In Agent 1's worktree
cp ../ar-compare-nextjs/data/* ./data/
cp ../ar-compare-nextjs/lib/config.ts ./lib/
cp ../ar-compare-nextjs/lib/constants.ts ./lib/

# Update imports and types
# Validate TypeScript compilation
```

### Phase 2: Static Assets (Agent 1 - Hour 1-2)
```bash
# Copy any actual images (if found)
cp -r ../ar-compare-nextjs/public/images/* ./public/images/

# Copy manifest and icons
cp ../ar-compare-nextjs/public/manifest.json ./public/
cp ../ar-compare-nextjs/public/favicon.ico ./public/
```

### Phase 3: Content Integration (Agent 3 - Hour 4-5)
- Import product data into new pages
- Set up blog post routing
- Integrate market analysis into homepage
- Update all metadata

### Phase 4: Content Validation (Agent 4 - Hour 7-8)
- Verify all products display correctly
- Check all blog posts render
- Validate SEO metadata
- Test image loading (even if placeholders)

## Critical Decisions Needed

### 1. Image Strategy
**Options**:
a) Launch with placeholders, add real images later
b) Source stock photos for each product
c) Use manufacturer press kit images
d) Generate AI images as temporary solution

**Recommendation**: Option C - Reach out to manufacturers for press kit access

### 2. Content Updates
**Needs Review**:
- Prices (may be outdated)
- Availability status
- New products to add (Meta Quest 3S?)
- Discontinued products to remove

### 3. Blog Content
**Options**:
a) Migrate as-is
b) Update dates and refresh content
c) Archive old posts, write new ones
d) Convert to MDX for rich content

**Recommendation**: Option B - Quick refresh of dates and stats

## Migration Checklist

### Pre-Migration
- [ ] Backup current site data
- [ ] Document all content locations
- [ ] Identify content owners
- [ ] Create content freeze period

### During Migration
- [ ] Copy all TypeScript data files
- [ ] Update import paths
- [ ] Validate types match new structure
- [ ] Test data loading
- [ ] Update configuration files
- [ ] Set up image CDN or placeholders

### Post-Migration
- [ ] Verify all products appear
- [ ] Check blog post rendering
- [ ] Validate SEO metadata
- [ ] Test comparison functionality
- [ ] Audit for missing content
- [ ] Update sitemap

## Special Considerations

### 1. Comparison State
Current site stores comparison state in context. New implementation should use:
```typescript
// Option 1: Local Storage
const comparisonState = localStorage.getItem('ar-compare-comparison')

// Option 2: URL State
/compare?products=apple-vision-pro,meta-quest-3

// Option 3: Both (recommended)
```

### 2. Search Functionality
Current search searches through:
- Product names
- Descriptions  
- Categories
- Brands

Ensure new implementation maintains this functionality.

### 3. Dynamic Routes
Preserve URL structure for SEO:
- `/products/[id]` → Same
- `/category/[slug]` → Same
- `/blog/[slug]` → Add if missing

## Risk Mitigation

### High Risk: Missing Images
**Mitigation**: 
- Have placeholder system ready
- Create image requirements doc
- Set up CDN in advance

### Medium Risk: Broken Links
**Mitigation**:
- Implement redirects for any URL changes
- Use Next.js redirect configuration
- Test all internal links

### Low Risk: Stale Content
**Mitigation**:
- Quick content review
- Update dates programmatically
- Flag outdated sections

## Implementation Timeline

**Hour 0-1**: Agent 1 copies all data files and configurations
**Hour 1-2**: Agent 1 sets up image handling strategy  
**Hour 4-5**: Agent 3 integrates content into pages
**Hour 7-8**: Agent 4 validates all content rendering
**Hour 8-9**: Final content audit and fixes

## Success Criteria

- [ ] All 8 products migrated and displaying
- [ ] Blog posts accessible (even if not linked)
- [ ] Images loading (placeholders acceptable)
- [ ] Comparison functionality working
- [ ] Search finding all products
- [ ] SEO metadata preserved
- [ ] No broken links
- [ ] Configuration properly updated

This migration plan ensures all existing content is preserved and properly integrated into the new Tailwind-based architecture.