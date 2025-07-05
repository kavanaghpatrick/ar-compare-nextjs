# Product Requirements Document: Structural Bug Fixes

## Document Information
- **Version:** 1.0
- **Date:** 2025-07-05
- **Project:** ar-compare-nextjs
- **Purpose:** Systematic resolution of structural rendering and CSS bugs

## Table of Contents
1. [CSS Architecture Consolidation](#1-css-architecture-consolidation)
2. [Hydration Mismatch Resolution](#2-hydration-mismatch-resolution)
3. [Layout Stability Enhancement](#3-layout-stability-enhancement)
4. [Z-Index Management System](#4-z-index-management-system)
5. [Semantic HTML Structure](#5-semantic-html-structure)

---

## 1. CSS Architecture Consolidation

### Problem Statement
Three competing global stylesheets (`globals.css`, `globals-simple.css`, `globals-unified.css`) cause unpredictable styling behavior and Tailwind utility override issues.

### User Stories
- As a developer, I need a single source of truth for global styles to ensure consistent rendering
- As a user, I expect consistent visual appearance across all pages

### Technical Requirements

#### 1.1 Stylesheet Consolidation
**Acceptance Criteria:**
- [ ] Single `globals.css` file exists
- [ ] All pages reference the same stylesheet
- [ ] No duplicate style definitions

**Implementation Steps:**
1. Audit all three stylesheets for unique styles
2. Create migration map documenting where each style should live
3. Merge styles into single file with clear sections:
   ```css
   /* Base Reset & Variables */
   /* Tailwind Directives */
   /* Component Styles (outside layers) */
   /* Utility Overrides */
   ```

#### 1.2 Layer Architecture
**Acceptance Criteria:**
- [ ] Critical component styles defined outside `@layer` directives
- [ ] Utility classes properly override when intended
- [ ] Clear specificity hierarchy documented

**Implementation:**
```css
/* globals.css structure */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Critical component styles - outside layers for proper specificity */
.product-card {
  /* styles that should not be overridden by utilities */
}

/* Optional component styles - inside layer */
@layer components {
  .optional-component {
    /* styles that can be overridden by utilities */
  }
}
```

#### 1.3 Migration Safety
**Acceptance Criteria:**
- [ ] Visual regression tests pass
- [ ] No style regressions on any page
- [ ] Rollback plan documented and tested

**Rollback Strategy:**
- All CSS changes developed on `feature/css-refactor` branch
- Visual regression snapshots taken before changes
- If major issues found, revert merge of feature branch
- Maintain backup of original CSS files in `/styles/legacy/`

### Success Metrics
- 0 CSS conflicts in browser console
- 100% visual regression test pass rate
- Single stylesheet import across all pages

---

## 2. Hydration Mismatch Resolution

### Problem Statement
Multiple HomeClient component variants indicate persistent hydration errors caused by client-side only operations during SSR.

### User Stories
- As a user, I expect the page to load without flickering or content jumps
- As a developer, I need clear patterns for handling client-side state

### Technical Requirements

#### 2.1 Client-Side State Management
**Acceptance Criteria:**
- [ ] All localStorage access wrapped in useEffect
- [ ] Window object access protected with typeof checks
- [ ] Loading states for client-specific data

**Implementation Pattern:**
```typescript
// ComparisonContext.tsx
const [items, setItems] = useState<ComparisonItem[]>([]);
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  // Client-side only operations
  const stored = localStorage.getItem('comparison-items');
  if (stored) {
    setItems(JSON.parse(stored));
  }
  setIsHydrated(true);
}, []);

// Render loading state until hydrated
if (!isHydrated) {
  return <ComparisonSkeleton />;
}
```

#### 2.2 Component Consolidation
**Acceptance Criteria:**
- [ ] Single HomeClient.tsx component
- [ ] All variant files removed
- [ ] No hydration warnings in console
- [ ] All components with client-side state audited

**Migration Steps:**
1. Identify differences between HomeClient variants
2. Extract client-only logic into custom hooks
3. Implement proper SSR/CSR boundaries
4. Delete redundant component files
5. Audit ALL components for client-side state:
   - ComparisonCart.tsx
   - SearchBar.tsx
   - Navigation.tsx (dropdowns)
   - ProductTabsClient.tsx
   - Any component using localStorage, window, or document

#### 2.3 SSR Compatibility Checklist
**Acceptance Criteria:**
- [ ] No direct DOM manipulation during render
- [ ] Dynamic imports for client-only libraries
- [ ] Proper use of Next.js `dynamic()` where needed

### Success Metrics
- 0 hydration warnings in development
- 0 hydration errors in production
- Single HomeClient component file

---

## 3. Layout Stability Enhancement

### Problem Statement
Missing image dimensions and dynamic content loading cause significant layout shifts (CLS).

### User Stories
- As a user, I want content to load without the page jumping around
- As a developer, I need tools to prevent layout shift

### Technical Requirements

#### 3.1 Image Dimension Enforcement
**Acceptance Criteria:**
- [ ] All images have explicit width/height attributes
- [ ] Responsive images use aspect-ratio containers
- [ ] Next/Image component used consistently

**Implementation:**
```typescript
// OptimizedImage.tsx enhancement
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number; // Required
  height: number; // Required
  priority?: boolean;
  className?: string;
}

// Product images with aspect ratio
<div className="aspect-w-4 aspect-h-3">
  <OptimizedImage
    src={product.image}
    alt={product.name}
    width={400}
    height={300}
    className="object-cover"
  />
</div>
```

#### 3.2 Skeleton Loading System
**Acceptance Criteria:**
- [ ] Skeleton components match exact dimensions
- [ ] Loading states prevent layout shift
- [ ] Smooth transitions from skeleton to content

**Components Needed:**
- ProductCardSkeleton
- NavigationSkeleton
- ContentSkeleton

#### 3.3 Dynamic Content Reservation
**Acceptance Criteria:**
- [ ] Space reserved for dynamic content
- [ ] Min-height set for variable content areas
- [ ] Lazy-loaded content doesn't shift layout

### Success Metrics
- CLS score < 0.1 (Good)
- 0 visible layout shifts during page load
- All images have dimensions defined

---

## 4. Z-Index Management System

### Problem Statement
No centralized z-index management causes overlay conflicts between modals, dropdowns, and floating elements.

### User Stories
- As a user, I expect modals to always appear above other content
- As a developer, I need predictable z-index behavior

### Technical Requirements

#### 4.1 Z-Index Token System
**Acceptance Criteria:**
- [ ] CSS variables define all z-index levels
- [ ] No hard-coded z-index values
- [ ] Clear stacking hierarchy

**Implementation:**
```css
/* globals.css */
:root {
  /* Z-Index Scale */
  --z-base: 0;
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-fixed: 150;
  --z-cart: 200;
  --z-modal-backdrop: 250;
  --z-modal: 300;
  --z-popover: 350;
  --z-tooltip: 400;
  --z-notification: 450;
  --z-max: 500;
}

/* Usage */
.navigation-dropdown {
  z-index: var(--z-dropdown);
}

.comparison-cart {
  z-index: var(--z-cart);
}

.quick-view-modal {
  z-index: var(--z-modal);
}
```

#### 4.2 Stacking Context Audit
**Acceptance Criteria:**
- [ ] Document all stacking contexts
- [ ] Fix conflicting contexts
- [ ] Test all overlay combinations

**Testing Matrix:**
| Component 1 | Component 2 | Expected Behavior |
|------------|-------------|-------------------|
| Dropdown | Modal | Modal above dropdown |
| Cart | QuickView | QuickView above cart |
| Navigation | Cart | Cart above navigation |
| Dropdown in Modal | Tooltip | Tooltip above all |
| Sticky Header | Modal | Modal above sticky |
| Nested Dropdown | Cart | Cart above dropdown |
| Toast/Notification | Modal | Toast above modal |

#### 4.3 Portal Implementation
**Acceptance Criteria:**
- [ ] Modals render in document.body
- [ ] Tooltips use portal pattern
- [ ] Proper cleanup on unmount

### Success Metrics
- 0 z-index conflicts
- All overlays stack correctly
- Consistent behavior across browsers

---

## 5. Semantic HTML Structure

### Problem Statement
Improper heading hierarchy and HTML structure breaks accessibility and SEO.

### User Stories
- As a screen reader user, I need proper heading structure to navigate
- As a developer, I need clear HTML semantic guidelines

### Technical Requirements

#### 5.1 Heading Hierarchy Fix
**Acceptance Criteria:**
- [ ] Each page has single h1
- [ ] Headings follow h1→h2→h3→h4 order
- [ ] No skipped heading levels

**Implementation Guide:**
```typescript
// Page structure
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <article>
      <h3>Article Title</h3>
    </article>
  </section>
</main>

// ProductCard.tsx fix
<article>
  <h2 className="sr-only">Product</h2>
  <h3>{product.name}</h3>
</article>
```

#### 5.2 Semantic Component Library
**Acceptance Criteria:**
- [ ] Components use correct semantic elements
- [ ] ARIA labels where needed
- [ ] Landmark roles properly used

**Component Updates:**
- Navigation: Use `<nav>` with aria-label
- Footer: Use `<footer>` with proper sections
- ProductCard: Use `<article>` with structured data

#### 5.3 Accessibility Validation
**Acceptance Criteria:**
- [ ] axe-core validation passes
- [ ] WAVE tool shows no errors
- [ ] Keyboard navigation works

### Success Metrics
- 0 accessibility errors
- Valid HTML5 structure
- Improved SEO scores

---

## Implementation Timeline

### Phase 1: Critical (Week 1)
- Day 1-3: CSS Architecture Consolidation (expanded timeline)
- Day 4-5: Hydration Fixes
- Day 6: Testing & Validation

### Phase 2: High Priority (Week 2)
- Day 1-2: Layout Stability
- Day 3: Z-Index Management
- Day 4-5: Integration Testing

### Phase 3: Completion (Week 3)
- Day 1-3: Semantic HTML (expanded timeline)
- Day 4: Full regression testing
- Day 5: Documentation & Handoff

## Risk Mitigation

### Rollback Strategy
1. Git branch for each phase
2. Feature flags for gradual rollout
3. Visual regression test suite
4. A/B testing on critical paths

### Testing Requirements
- Unit tests for new utilities
- Integration tests for hydration
- Visual regression tests
- Performance benchmarks
- Accessibility audits

## Success Criteria
1. **Performance**: CLS < 0.1, FID < 100ms, LCP < 2.5s
2. **Quality**: 0 console errors/warnings
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Developer Experience**: Clear documentation, reusable patterns

## Appendix

### Reference Documentation
- [Next.js Hydration Guide](https://nextjs.org/docs/messages/react-hydration-error)
- [Tailwind CSS Layers](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)
- [Web.dev CLS Guide](https://web.dev/cls/)
- [MDN Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Code Examples Repository
Create `/docs/examples/` with reference implementations for each fix.