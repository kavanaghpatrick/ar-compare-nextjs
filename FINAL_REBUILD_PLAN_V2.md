# AR Compare Complete Rebuild Plan V2: Expert-Enhanced Edition

## Executive Summary

Complete ground-up rebuild using 4 specialized agents with expert recommendations from Next.js 15, Tailwind CSS, and Backend Architecture specialists fully integrated. This plan addresses all critical gaps identified in the expert analysis.

## Technology Stack (Enhanced)

- **Framework**: Next.js 15 App Router with PPR, Streaming SSR
- **Styling**: Tailwind CSS 3 with CSS custom properties, dark mode
- **Components**: CVA (Class Variance Authority) for variants
- **Data**: Repository pattern with abstraction layer
- **API**: Edge-optimized route handlers
- **Caching**: Multi-layer strategy (CDN, App, Database)
- **Monitoring**: Vercel Analytics, Sentry, Web Vitals

## Enhanced Project Structure

```
ar-compare-nextjs-v2/
├── app/
│   ├── (marketing)/              # Route group for public pages
│   │   ├── page.tsx             # Homepage
│   │   ├── about/
│   │   └── blog/
│   ├── (shop)/                  # Route group for product pages
│   │   ├── products/
│   │   ├── category/
│   │   └── search/
│   ├── api/                     # API routes
│   │   └── v1/
│   │       ├── products/
│   │       ├── search/
│   │       └── revalidate/
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Global loading
│   ├── error.tsx                # Error boundary
│   └── global-error.tsx         # Global error boundary
├── components/
│   ├── ui/                      # Base components with CVA
│   ├── layout/
│   ├── product/
│   └── providers/               # Context providers
├── lib/
│   ├── data/                    # Data layer abstraction
│   │   ├── repository.ts
│   │   └── repositories/
│   ├── utils/
│   ├── hooks/
│   └── monitoring/
├── next.config.js               # Enhanced Next.js config
└── tailwind.config.ts           # Enhanced Tailwind config
```

## Agent Definitions V2 (Expert-Enhanced)

### Agent 1: Foundation Architect & Data Layer Expert
**Worktree**: `agent-1-foundation`  
**Branch**: `foundation-rebuild`  
**Hours**: 0-3

**Enhanced Responsibilities**:

1. **Next.js 15 Configuration** (Hour 0-0.5)
```javascript
// next.config.js
module.exports = {
  experimental: {
    ppr: true, // Partial Prerendering
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}
```

2. **Enhanced Tailwind Configuration** (Hour 0.5-1)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS custom properties for theming
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        
        // Static brand colors
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
```

3. **CSS Custom Properties** (Hour 1-1.5)
```css
/* app/globals.css */
@layer base {
  :root {
    /* Light mode */
    --color-primary: 37 99 235;
    --color-secondary: 100 116 139;
    --color-background: 255 255 255;
    --color-foreground: 15 23 42;
    --color-muted: 100 116 139;
    --color-accent: 59 130 246;
    
    /* Spacing */
    --space-unit: 0.25rem;
  }
  
  .dark {
    /* Dark mode */
    --color-primary: 96 165 250;
    --color-secondary: 148 163 184;
    --color-background: 15 23 42;
    --color-foreground: 248 250 252;
    --color-muted: 148 163 184;
    --color-accent: 147 197 253;
  }
}
```

4. **Data Abstraction Layer** (Hour 1.5-2.5)
```typescript
// lib/data/repository.ts
export interface Repository<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  search(query: string, filters?: SearchFilters): Promise<T[]>
  getByCategory(category: string): Promise<T[]>
}

// lib/data/repositories/product.repository.ts
import { Product } from '@/lib/types'
import { products as staticProducts } from '@/data/products'

export class ProductRepository implements Repository<Product> {
  // Start with static data
  async getAll(): Promise<Product[]> {
    return staticProducts
  }
  
  async getById(id: string): Promise<Product | null> {
    return staticProducts.find(p => p.id === id) || null
  }
  
  async search(query: string, filters?: SearchFilters): Promise<Product[]> {
    let results = staticProducts
    
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    
    if (filters?.category) {
      results = results.filter(p => p.category === filters.category)
    }
    
    return results
  }
  
  async getByCategory(category: string): Promise<Product[]> {
    return staticProducts.filter(p => p.category === category)
  }
}

// lib/data/index.ts
export const productRepository = new ProductRepository()
```

5. **Root Layout with Providers** (Hour 2.5-3)
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Agent 2: Component Library Engineer (Enhanced)
**Worktree**: `agent-2-components`  
**Branch**: `component-library`  
**Hours**: 1-5

**Enhanced Components with CVA**:

1. **Base UI Components with Variants** (Hour 1-3)
```typescript
// components/ui/button.tsx
'use client' // Only because of onClick handlers

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

2. **Product Card (Server Component)** (Hour 3-4)
```typescript
// components/product/product-card.tsx
// NO 'use client' - This is a server component
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({ 
  product, 
  className,
  priority = false 
}: ProductCardProps) {
  return (
    <article 
      className={cn(
        "group relative bg-background rounded-lg border p-6",
        "hover:shadow-lg transition-all duration-200",
        "dark:border-gray-800 dark:hover:border-gray-700",
        className
      )}
    >
      {/* Product Image */}
      <div className="aspect-[4/3] relative mb-4 overflow-hidden rounded-md">
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {product.fullName}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {product.category}
          </Badge>
        </div>
        
        <p className="text-sm text-muted line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Specs Preview */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted">
          <div className="flex items-center gap-1">
            <span className="font-medium">FOV:</span>
            <span>{product.specifications.display.fov}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Weight:</span>
            <span>{product.specifications.design.weight}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="default" size="sm" className="flex-1">
            Compare
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
```

3. **Loading Skeletons** (Hour 4-5)
```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

// components/product/product-card-skeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-background rounded-lg border p-6">
      <Skeleton className="aspect-[4/3] mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-8 w-24 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
```

### Agent 3: Pages & Routing Specialist (Enhanced)
**Worktree**: `agent-3-pages`  
**Branch**: `pages-routing`  
**Hours**: 3-7

**Enhanced Pages with Next.js 15 Features**:

1. **Homepage with Streaming SSR** (Hour 3-4)
```typescript
// app/(marketing)/page.tsx
import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { MarketAnalysis } from '@/components/home/market-analysis'
import { FeaturedProducts } from '@/components/home/featured-products'
import { FAQ } from '@/components/home/faq'
import { MarketAnalysisSkeleton } from '@/components/home/market-analysis-skeleton'
import { ProductGridSkeleton } from '@/components/product/product-grid-skeleton'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <Suspense fallback={<MarketAnalysisSkeleton />}>
        <MarketAnalysisWrapper />
      </Suspense>
      
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <FeaturedProductsWrapper />
      </Suspense>
      
      <FAQ />
    </main>
  )
}

// Async components for data fetching
async function MarketAnalysisWrapper() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/market-analysis`, {
    next: { revalidate: 3600 } // ISR: 1 hour
  }).then(res => res.json())
  
  return <MarketAnalysis data={data} />
}

async function FeaturedProductsWrapper() {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?featured=true`, {
    next: { revalidate: 3600 }
  }).then(res => res.json())
  
  return <FeaturedProducts products={products} />
}
```

2. **Product Pages with Metadata** (Hour 4-5)
```typescript
// app/(shop)/products/[id]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { productRepository } from '@/lib/data'
import { ProductDisplay } from '@/components/product/product-display'
import { RelatedProducts } from '@/components/product/related-products'
import { Suspense } from 'react'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await productRepository.getById(params.id)
  
  if (!product) return {}
  
  return {
    title: `${product.fullName} | AR Compare`,
    description: product.description,
    openGraph: {
      title: product.fullName,
      description: product.description,
      images: [product.image || '/og-default.jpg'],
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const products = await productRepository.getAll()
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({ params }: PageProps) {
  const product = await productRepository.getById(params.id)
  
  if (!product) {
    notFound()
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDisplay product={product} />
      
      <Suspense fallback={<div>Loading related products...</div>}>
        <RelatedProducts 
          category={product.category} 
          currentProductId={product.id} 
        />
      </Suspense>
    </main>
  )
}
```

3. **Search Page with Server Actions** (Hour 5-6)
```typescript
// app/(shop)/search/page.tsx
import { Suspense } from 'react'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { searchProducts } from './actions'

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>
        
        <main className="lg:col-span-3">
          <Suspense 
            key={JSON.stringify(searchParams)} 
            fallback={<div>Searching...</div>}
          >
            <SearchResultsWrapper searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

async function SearchResultsWrapper({ searchParams }: { searchParams: SearchPageProps['searchParams'] }) {
  const results = await searchProducts(searchParams)
  return <SearchResults results={results} />
}

// app/(shop)/search/actions.ts
'use server'

import { productRepository } from '@/lib/data'

export async function searchProducts(params: {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}) {
  const products = await productRepository.search(params.q || '', {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  })
  
  // Apply sorting
  if (params.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price)
  } else if (params.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price)
  }
  
  return products
}
```

4. **Loading and Error States** (Hour 6-7)
```typescript
// app/loading.tsx
export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  )
}

// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error)
  }, [error])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted">We're sorry for the inconvenience.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
```

### Agent 4: Features, API & Optimization Expert
**Worktree**: `agent-4-features`  
**Branch**: `features-interactions`  
**Hours**: 5-9

**Enhanced Features with API Routes**:

1. **API Routes with Edge Runtime** (Hour 5-6)
```typescript
// app/api/v1/products/route.ts
import { NextRequest } from 'next/server'
import { productRepository } from '@/lib/data'

export const runtime = 'edge' // Use edge runtime for better performance

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  
  let products = await productRepository.getAll()
  
  if (category) {
    products = products.filter(p => p.category === category)
  }
  
  if (featured === 'true') {
    products = products.slice(0, 4) // Simple featured logic
  }
  
  return Response.json({
    data: products,
    meta: {
      total: products.length,
      timestamp: new Date().toISOString()
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    }
  })
}

// app/api/v1/search/route.ts
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { query, filters } = await request.json()
  
  const results = await productRepository.search(query, filters)
  
  return Response.json({
    data: results,
    meta: {
      total: results.length,
      query,
      filters
    }
  })
}
```

2. **Comparison Feature with State** (Hour 6-7)
```typescript
// components/providers/comparison-provider.tsx
'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Product } from '@/lib/types'

interface ComparisonContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearAll: () => void
  isInComparison: (productId: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | null>(null)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  
  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.length >= 4 || prev.some(p => p.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }, [])
  
  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId))
  }, [])
  
  const clearAll = useCallback(() => {
    setItems([])
  }, [])
  
  const isInComparison = useCallback((productId: string) => {
    return items.some(p => p.id === productId)
  }, [items])
  
  return (
    <ComparisonContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearAll,
      isInComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider')
  }
  return context
}
```

3. **Performance Monitoring** (Hour 7-8)
```typescript
// lib/monitoring/web-vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  const body = JSON.stringify(metric)
  
  // Use sendBeacon if available
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body)
  } else {
    fetch('/api/analytics', { body, method: 'POST', keepalive: true })
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFID(sendToAnalytics)
  onLCP(sendToAnalytics)
  onFCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

// app/(marketing)/layout.tsx - Call in client component
'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/monitoring/web-vitals'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals()
  }, [])
  
  return <>{children}</>
}
```

4. **Search Implementation with Debouncing** (Hour 8-9)
```typescript
// components/search/search-bar.tsx
'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  
  const debouncedQuery = useDebounce(query, 300)
  
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }
    
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }, [debouncedQuery, router, searchParams])
  
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
      className="relative flex gap-2"
    >
      <Input
        type="search"
        placeholder="Search AR glasses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
```

## Optimized Integration Timeline

### Phase 1: Foundation & Data (Hours 0-3)
**Agent 1 Focus**:
- ✅ Next.js 15 config with PPR, security headers
- ✅ Tailwind with CSS custom properties, dark mode
- ✅ Data repository pattern
- ✅ Content migration
- ✅ Root layout with providers

### Phase 2: Components (Hours 1-5)
**Agent 2 Focus**:
- ✅ CVA-based component system
- ✅ Server vs Client components properly marked
- ✅ Loading skeletons for all components
- ✅ Dark mode support in all components

### Phase 3: Pages & Routes (Hours 3-7)
**Agent 3 Focus**:
- ✅ Streaming SSR with Suspense
- ✅ Proper data fetching patterns
- ✅ Metadata API usage
- ✅ Loading and error boundaries
- ✅ Server Actions implementation

### Phase 4: Features & API (Hours 5-9)
**Agent 4 Focus**:
- ✅ Edge-optimized API routes
- ✅ Comparison state management
- ✅ Performance monitoring
- ✅ Search with debouncing
- ✅ Analytics integration

## Critical Success Factors

### Performance Targets
- LCP < 2.5s on 3G
- FID < 100ms
- CLS < 0.1
- TTI < 3.5s
- Bundle size < 100KB (JS)

### Technical Requirements
- ✅ All Server Components by default
- ✅ Client Components only when needed
- ✅ Proper Suspense boundaries
- ✅ API routes with caching
- ✅ Multi-layer caching strategy
- ✅ Dark mode support
- ✅ Type safety throughout

### Monitoring & Analytics
- Vercel Analytics
- Web Vitals tracking
- Error boundary reporting
- Custom event tracking

## Final Checklist

### Agent 1 Deliverables
- [ ] Next.js 15 config with all optimizations
- [ ] Tailwind config with CSS properties
- [ ] Data repository pattern implemented
- [ ] All content migrated
- [ ] Root layout with providers

### Agent 2 Deliverables
- [ ] All UI components with CVA
- [ ] Server/Client boundaries correct
- [ ] Loading skeletons complete
- [ ] Dark mode working

### Agent 3 Deliverables
- [ ] All pages using Suspense
- [ ] Metadata API implemented
- [ ] Server Actions working
- [ ] Error boundaries in place

### Agent 4 Deliverables
- [ ] API routes deployed
- [ ] Search functioning
- [ ] Comparison working
- [ ] Performance monitored
- [ ] Analytics integrated

This enhanced plan incorporates all expert recommendations for a production-ready, scalable application.