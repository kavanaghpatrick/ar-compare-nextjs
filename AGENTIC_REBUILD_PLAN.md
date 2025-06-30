# AR Compare Agentic Rebuild Plan: 4 Parallel Agents

## Overview

Complete ground-up rebuild using 4 specialized agents working in parallel git worktrees. Each agent owns specific domains and works independently to maximize throughput while minimizing conflicts.

## Agent Architecture

### Worktree Setup
```bash
# Main repository remains as coordination point
/ar-compare/ar-compare-nextjs/              # Main branch (coordination)

# Agent worktrees
/ar-compare/agent-1-foundation/             # Foundation & Infrastructure
/ar-compare/agent-2-components/             # Component Library
/ar-compare/agent-3-pages/                  # Pages & Routing  
/ar-compare/agent-4-features/               # Features & Interactions
```

## Agent Definitions

### Agent 1: Foundation Architect
**Worktree**: `agent-1-foundation`  
**Branch**: `foundation-rebuild`

**Ownership**:
- Project setup and configuration
- Tailwind CSS configuration
- Base layouts and app structure
- Routing architecture
- Type definitions
- Utility functions
- Environment setup

**Deliverables**:
```
- tailwind.config.ts (complete design system)
- app/layout.tsx (minimal, clean root layout)
- lib/types.ts (all TypeScript interfaces)
- lib/utils.ts (utility functions)
- lib/constants.ts (app constants)
- Base folder structure
- Package installations
```

**Key Tasks**:
1. Create new Next.js 15 project with TypeScript
2. Install and configure Tailwind CSS 3
3. Set up design tokens and theme
4. Create type system for entire app
5. Build utility functions
6. Set up path aliases and environment

### Agent 2: Component Library Engineer
**Worktree**: `agent-2-components`  
**Branch**: `component-library`  
**Depends on**: Agent 1's types and Tailwind config

**Ownership**:
- All reusable UI components
- Component documentation
- Component testing
- Storybook setup (optional)

**Deliverables**:
```
components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   └── modal.tsx
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── mobile-menu.tsx
└── product/
    ├── product-card.tsx
    ├── product-grid.tsx
    ├── product-filters.tsx
    ├── product-comparison.tsx
    └── product-quick-view.tsx
```

**Key Tasks**:
1. Build atomic UI components with Tailwind
2. Create layout components (Header, Footer, Nav)
3. Build product-specific components
4. Ensure all components have proper TypeScript types
5. Test components in isolation

### Agent 3: Pages & Routing Specialist
**Worktree**: `agent-3-pages`  
**Branch**: `pages-routing`  
**Depends on**: Agent 1's layout, Agent 2's components

**Ownership**:
- All Next.js pages
- Routing logic
- Page-level components
- SEO metadata
- Loading and error states

**Deliverables**:
```
app/
├── page.tsx                    # Homepage
├── search/
│   └── page.tsx               # Search results
├── category/
│   └── [slug]/
│       └── page.tsx           # Category pages
├── products/
│   └── [id]/
│       └── page.tsx           # Product details
├── compare/
│   └── page.tsx               # Comparison page
├── loading.tsx                # Loading states
├── error.tsx                  # Error boundary
└── not-found.tsx              # 404 page
```

**Key Tasks**:
1. Build all main pages using Agent 2's components
2. Implement dynamic routing for categories/products
3. Add metadata for SEO
4. Create loading and error states
5. Ensure proper data fetching patterns

### Agent 4: Features & Interactions Developer
**Worktree**: `agent-4-features`  
**Branch**: `features-interactions`  
**Depends on**: All other agents

**Ownership**:
- Interactive features
- Client-side state management
- Animations and transitions
- Search and filter logic
- Comparison functionality
- Performance optimizations

**Deliverables**:
```
- Search functionality with filters
- Product comparison logic
- Quick view modals
- Smooth animations
- Loading skeletons
- Image optimization
- Client-side interactions
- Local storage for comparisons
```

**Key Tasks**:
1. Implement search and filter functionality
2. Build comparison system with state management
3. Add animations and transitions
4. Optimize performance (lazy loading, etc.)
5. Add interactive enhancements

## Coordination Protocol

### 1. Initial Setup (Hour 0)
```bash
# Main coordinator creates base repository
git init ar-compare-nextjs-v2
cd ar-compare-nextjs-v2

# Create branches for each agent
git branch foundation-rebuild
git branch component-library  
git branch pages-routing
git branch features-interactions

# Create worktrees
git worktree add ../agent-1-foundation foundation-rebuild
git worktree add ../agent-2-components component-library
git worktree add ../agent-3-pages pages-routing
git worktree add ../agent-4-features features-interactions
```

### 2. Communication Protocol

**Shared Resources Location**: Each agent commits interface files to a `shared/` directory
```
shared/
├── types.ts          # From Agent 1
├── tailwind.json     # From Agent 1 (config summary)
├── components.ts     # From Agent 2 (component exports)
└── routes.ts         # From Agent 3 (route definitions)
```

**Sync Points**:
- Hour 2: Agent 1 completes foundation → Others pull
- Hour 4: Agent 2 completes core components → Agent 3 & 4 pull
- Hour 6: Agent 3 completes pages → Agent 4 integrates
- Hour 8: Final integration and testing

### 3. Merge Strategy

```bash
# Progressive integration into main
git checkout main

# Phase 1: Foundation
git merge foundation-rebuild

# Phase 2: Components (after foundation is stable)
git merge component-library

# Phase 3: Pages (after components are ready)  
git merge pages-routing

# Phase 4: Features (final layer)
git merge features-interactions
```

## Agent Work Patterns

### Agent 1 Sprint (Hours 0-2)
```typescript
// 1. Create Next.js project
npx create-next-app@latest ar-compare-v2 --typescript --app --tailwind

// 2. Configure Tailwind with full design system
// tailwind.config.ts with colors, fonts, animations

// 3. Create type system
// lib/types.ts with Product, Category, etc.

// 4. Build utilities
// lib/utils.ts with cn(), formatPrice(), etc.

// 5. Set up clean layout
// app/layout.tsx with minimal structure
```

### Agent 2 Sprint (Hours 1-4)
```typescript
// 1. Pull Agent 1's types and config
// 2. Build UI components
// 3. Create product components
// 4. Build layout components
// 5. Export all components cleanly
```

### Agent 3 Sprint (Hours 3-6)
```typescript
// 1. Pull latest from Agent 1 & 2
// 2. Build homepage with components
// 3. Create search page
// 4. Build category pages
// 5. Implement product pages
// 6. Add comparison page
```

### Agent 4 Sprint (Hours 5-8)
```typescript
// 1. Pull latest from all agents
// 2. Add search/filter logic
// 3. Implement comparison state
// 4. Add animations
// 5. Optimize performance
// 6. Final polish
```

## Quality Checkpoints

### Each Agent Must:
1. **Use Tailwind exclusively** - No custom CSS files
2. **Ensure text contrast** - All text readable on backgrounds
3. **Mobile-first** - Test on mobile viewport
4. **TypeScript strict** - No any types
5. **Performance focused** - Lazy load where appropriate

### Integration Checklist:
- [ ] No merge conflicts between agents
- [ ] All components render correctly
- [ ] No white-on-white text issues
- [ ] Mobile responsive throughout
- [ ] Fast page loads
- [ ] TypeScript compilation passes
- [ ] All routes working

## Example Component (Shared Pattern)

Each agent should follow this pattern for consistency:

```typescript
// components/product/product-card.tsx
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-6",
      "hover:border-brand-300 hover:shadow-lg",
      "transition-all duration-200",
      className
    )}>
      {/* Always explicit text colors */}
      <h3 className="text-lg font-semibold text-gray-900">
        {product.fullName}
      </h3>
      <p className="text-sm text-brand-600 font-medium">
        {product.category}
      </p>
      {/* ... rest of component */}
    </div>
  )
}
```

## Final Integration

### Hour 8-9: Integration & Testing
1. Merge all branches into main
2. Test every page and component
3. Fix any integration issues
4. Performance audit
5. Final build and deploy

## Success Metrics
- ✅ Complete rebuild finished in ~9 hours
- ✅ No CSS conflicts or overrides  
- ✅ All text readable (no white-on-white)
- ✅ Consistent Tailwind-based design
- ✅ Excellent performance scores
- ✅ Clean, maintainable codebase

This agentic approach with parallel worktrees allows maximum velocity while maintaining quality through clear ownership boundaries and coordination points.