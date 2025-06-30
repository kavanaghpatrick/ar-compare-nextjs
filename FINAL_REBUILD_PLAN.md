# AR Compare Complete Rebuild Plan: Final Integrated Version

## Executive Summary

Complete ground-up rebuild using 4 specialized agents working in parallel git worktrees, with integrated content migration strategy. This plan merges the agentic development approach with content migration requirements for optimal sequencing.

## Technology Stack

- **Styling**: Tailwind CSS 3 (zero runtime, perfect Next.js 15 support)
- **Framework**: Next.js 15 App Router with TypeScript
- **Architecture**: 4 parallel agents in git worktrees
- **Content**: Migration of existing product data, blog posts, and configurations

## Agent Architecture with Content Responsibilities

### Worktree Setup
```bash
/ar-compare/ar-compare-nextjs/              # Current site (source for content)
/ar-compare/ar-compare-nextjs-v2/           # New main branch (coordination)

# Agent worktrees
/ar-compare/agent-1-foundation/             # Foundation & Content Migration
/ar-compare/agent-2-components/             # Component Library
/ar-compare/agent-3-pages/                  # Pages & Content Integration
/ar-compare/agent-4-features/               # Features & Polish
```

## Optimized Timeline & Sequencing

### Hour 0: Project Initialization
```bash
# Coordinator sets up base repository and worktrees
cd /ar-compare
npx create-next-app@latest ar-compare-nextjs-v2 --typescript --app --tailwind --no-src-dir
cd ar-compare-nextjs-v2

# Create branches and worktrees
git branch foundation-rebuild
git branch component-library  
git branch pages-routing
git branch features-interactions

git worktree add ../agent-1-foundation foundation-rebuild
git worktree add ../agent-2-components component-library
git worktree add ../agent-3-pages pages-routing
git worktree add ../agent-4-features features-interactions
```

## Agent Definitions with Content Integration

### Agent 1: Foundation Architect & Content Migrator
**Worktree**: `agent-1-foundation`  
**Branch**: `foundation-rebuild`  
**Hours**: 0-3

**Expanded Responsibilities**:
1. **Foundation Setup** (Hour 0-1)
   - Configure Tailwind with complete design system
   - Create type definitions
   - Set up utilities and constants
   - Build base layout structure

2. **Content Migration** (Hour 1-2)
   ```bash
   # Copy all data files
   cp ../ar-compare-nextjs/data/*.ts ./data/
   cp ../ar-compare-nextjs/lib/config.ts ./lib/
   cp ../ar-compare-nextjs/lib/constants.ts ./lib/
   
   # Copy public assets
   cp ../ar-compare-nextjs/public/manifest.json ./public/
   cp ../ar-compare-nextjs/public/favicon.ico ./public/
   ```

3. **Content Validation** (Hour 2-3)
   - Update imports to match new structure
   - Validate TypeScript types
   - Create image placeholder strategy
   - Document missing assets

**Key Deliverables**:
```
Project Structure:
├── tailwind.config.ts         # Complete design system
├── app/
│   └── layout.tsx            # Minimal root layout
├── lib/
│   ├── types.ts              # All TypeScript interfaces
│   ├── utils.ts              # Utility functions (cn, formatPrice)
│   ├── constants.ts          # App constants
│   └── config.ts             # App configuration
├── data/
│   ├── products.ts           # 8 products migrated
│   ├── blog.ts               # 5 blog posts migrated
│   └── market-analysis.ts    # Market data migrated
└── public/
    ├── manifest.json         # PWA manifest
    └── favicon.ico           # App icon
```

**Tailwind Config** (tailwind.config.ts):
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### Agent 2: Component Library Engineer
**Worktree**: `agent-2-components`  
**Branch**: `component-library`  
**Hours**: 1-5  
**Depends on**: Agent 1's types and Tailwind config (Hour 1+)

**Responsibilities with Content Awareness**:
1. Build UI components that handle existing content structure
2. Create ProductCard component matching product data schema
3. Build components for blog post display
4. Ensure all components explicitly set text colors

**Critical Components for Content**:
```typescript
// components/product/product-card.tsx
import { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all">
      {/* Explicit text colors throughout */}
      <h3 className="text-lg font-semibold text-gray-900">{product.fullName}</h3>
      <p className="text-sm text-brand-600 font-medium">{product.category}</p>
      <div className="flex items-baseline gap-2 mt-4">
        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
        )}
      </div>
      {/* Handle specifications from data */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div className="text-gray-600">FOV: {product.specifications.display.fov}</div>
        <div className="text-gray-600">Weight: {product.specifications.design.weight}</div>
      </div>
    </div>
  )
}
```

### Agent 3: Pages & Content Integration Specialist
**Worktree**: `agent-3-pages`  
**Branch**: `pages-routing`  
**Hours**: 3-7  
**Depends on**: Agent 1's data + Agent 2's components

**Content Integration Focus**:
1. Import and display all 8 products
2. Implement blog post pages
3. Integrate market analysis data into homepage
4. Preserve SEO with proper metadata

**Key Pages with Content**:
```typescript
// app/page.tsx - Homepage with market data
import { marketAnalysis } from '@/data/market-analysis'
import { products } from '@/data/products'

export default function HomePage() {
  const featuredProducts = products.slice(0, 4)
  
  return (
    <main>
      <HeroSection />
      <MarketAnalysis data={marketAnalysis} />
      <FeaturedProducts products={featuredProducts} />
      <FAQ />
    </main>
  )
}

// app/products/[id]/page.tsx - Dynamic product pages
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

// app/search/page.tsx - Search with existing products
export default function SearchPage() {
  // Use products from data/products.ts
  return <ProductGrid products={products} />
}
```

### Agent 4: Features & Final Integration
**Worktree**: `agent-4-features`  
**Branch**: `features-interactions`  
**Hours**: 5-9  
**Depends on**: All other agents

**Content Enhancement Responsibilities**:
1. Implement search through migrated products
2. Add comparison using existing product data
3. Handle placeholder images gracefully
4. Optimize performance with content

**Search Implementation**:
```typescript
// Search through migrated content
function searchProducts(query: string) {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  )
}
```

## Optimized Migration Sequence

### Phase 1: Foundation & Data (Hours 0-3)
**Agent 1 Solo Work**:
1. Set up Next.js with Tailwind
2. Configure design system
3. **Migrate all data files**
4. Create type system
5. Set up image placeholder strategy

**Checkpoint**: All data available in new project

### Phase 2: Component Building (Hours 1-5)
**Agent 2 starts after Agent 1 shares types**:
1. Pull Agent 1's types and data structure
2. Build components that match content schema
3. Test with migrated data
4. Create blog components

**Checkpoint**: Components ready for content

### Phase 3: Page Creation (Hours 3-7)
**Agent 3 starts after foundation ready**:
1. Pull latest data and components
2. Build pages using real content
3. Implement dynamic routes for products
4. Add blog post pages
5. Integrate market analysis

**Checkpoint**: All content displayed

### Phase 4: Enhancement (Hours 5-9)
**Agent 4 polishes and optimizes**:
1. Add search through products
2. Implement comparison
3. Add loading states for images
4. Performance optimization
5. Final content validation

**Checkpoint**: Fully functional site

## Content-Specific Considerations

### Image Handling Strategy
```typescript
// lib/utils/images.ts
export function getProductImage(productId: string, type: 'main' | 'thumbnail' = 'main') {
  // Development: Use placeholder
  if (process.env.NODE_ENV === 'development') {
    return `https://via.placeholder.com/${type === 'main' ? '800x600' : '400x300'}`
  }
  
  // Production: Use CDN or fallback
  const imageUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/products/${productId}/${type}.jpg`
  return imageUrl || `https://via.placeholder.com/${type === 'main' ? '800x600' : '400x300'}`
}
```

### SEO Preservation
```typescript
// Maintain URL structure
export const routes = {
  product: (id: string) => `/products/${id}`,
  category: (slug: string) => `/category/${slug}`,
  blog: (slug: string) => `/blog/${slug}`,
  search: (params?: URLSearchParams) => `/search${params ? `?${params}` : ''}`,
}
```

### Content Validation Checklist

**Hour 3 (After Agent 1)**:
- [ ] All 8 products imported correctly
- [ ] Blog posts data available
- [ ] Market analysis data ready
- [ ] Types match content structure

**Hour 5 (After Agent 2)**:
- [ ] ProductCard displays all fields
- [ ] Blog components handle markdown
- [ ] Components work with real data

**Hour 7 (After Agent 3)**:
- [ ] All products have pages
- [ ] Blog posts render correctly
- [ ] Search finds all products
- [ ] Categories work properly

**Hour 9 (Final)**:
- [ ] Comparison works with product data
- [ ] Images load (even if placeholders)
- [ ] All content accessible
- [ ] Performance optimized

## Risk Mitigation

### Content Risks
1. **Missing Images**: Placeholder system ready from Hour 1
2. **Stale Data**: Agent 1 reviews and updates during migration
3. **Broken Links**: Agent 3 maintains URL structure
4. **Lost Content**: Full backup before starting

### Technical Risks
1. **Type Mismatches**: Agent 1 validates all types
2. **Component-Data Mismatch**: Agent 2 tests with real data
3. **Performance Issues**: Agent 4 optimizes at end

## Final Integration (Hour 9)

```bash
# Main branch integration
cd /ar-compare/ar-compare-nextjs-v2
git checkout main

# Merge in sequence
git merge foundation-rebuild
git merge component-library
git merge pages-routing
git merge features-interactions

# Final validation
npm run build
npm run lint
npm run type-check
```

## Success Metrics

### Content Success
- ✅ All 8 products migrated and displaying
- ✅ 5 blog posts accessible
- ✅ Market analysis integrated
- ✅ SEO metadata preserved
- ✅ Search finding all content

### Technical Success
- ✅ No white-on-white text issues
- ✅ Tailwind-only styling
- ✅ TypeScript fully typed
- ✅ Performance optimized
- ✅ Mobile responsive

## Next Steps

1. **Hour 0**: Initialize project and worktrees
2. **Hour 0-3**: Agent 1 builds foundation and migrates content
3. **Hour 1-5**: Agent 2 creates components for content
4. **Hour 3-7**: Agent 3 builds pages with real data
5. **Hour 5-9**: Agent 4 adds features and polish
6. **Hour 9**: Final integration and testing

This integrated plan ensures efficient parallel development while properly sequencing content migration for optimal results.