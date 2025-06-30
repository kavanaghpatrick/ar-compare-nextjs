# CSS Conflict Analysis Report: White Text on White Background Issue

## Summary
The product cards are showing white text on white backgrounds due to CSS conflicts where "Product Details Page" styles are overriding the base product card styles globally, without proper scoping.

## Root Cause
The CSS file contains unscoped styles intended for the product details page that are applying to ALL product cards throughout the application.

## Detailed Findings

### 1. Base Product Card Styles (Correct)
Located at lines 330-376 in `app/globals.css`:
```css
.product-title {
  @apply text-xl font-bold text-gray-900 mb-2;  /* Dark gray text - CORRECT */
}

.product-description {
  @apply text-gray-600 mb-3 text-sm;  /* Medium gray text - CORRECT */
}

.rating-text {
  @apply text-gray-900 font-semibold;  /* Dark gray text - CORRECT */
}

.spec-item {
  @apply text-gray-700 flex items-center gap-1;  /* Dark gray text - CORRECT */
}
```

### 2. Conflicting Product Details Page Styles (Problem)
Multiple sections override these with white text:

#### Section 1 (Lines 950-963):
```css
/* These styles are NOT scoped to product details page! */
.spec-item {
  @apply flex justify-between items-center py-2 border-b border-white/10 last:border-b-0;
}

.spec-item span:first-child {
  @apply text-white/70 font-medium;  /* WHITE TEXT - PROBLEM */
}

.spec-item span:last-child {
  @apply text-white font-semibold;  /* WHITE TEXT - PROBLEM */
}
```

#### Section 2 (Lines 1212-1222):
```css
/* Duplicate white text overrides */
.spec-item span:first-child {
  @apply text-white/70;  /* WHITE TEXT - PROBLEM */
}

.spec-item span:last-child {
  @apply text-white font-medium;  /* WHITE TEXT - PROBLEM */
}
```

#### Section 3 (Lines 981-983, 1245-1247):
```css
.product-description {
  @apply text-white/80 leading-relaxed;  /* WHITE TEXT - PROBLEM */
}
```

## Recommendations

### Option 1: Scope Product Details Styles (Recommended)
Add a parent class to limit these styles to the product details page only:

```css
/* Wrap all product details page styles */
.product-details-page {
  .spec-item span:first-child {
    @apply text-white/70;
  }
  
  .spec-item span:last-child {
    @apply text-white;
  }
  
  .product-description {
    @apply text-white/80;
  }
}
```

### Option 2: Use More Specific Selectors
Target only elements within the product details container:

```css
.product-details .spec-item span:first-child,
.product-content .spec-item span:first-child {
  @apply text-white/70;
}
```

### Option 3: Remove Duplicate Styles
1. Remove the duplicate white text declarations (lines 1212-1222, 1245-1247)
2. Keep only one set of product details styles, properly scoped

### Option 4: Use CSS Modules or Styled Components
Consider refactoring to CSS Modules to prevent global style conflicts entirely.

## Immediate Fix
To fix the issue immediately, you need to:

1. **Remove or comment out** the conflicting white text styles (lines 950-963, 1212-1222, 981-983, 1245-1247)
2. **OR** wrap them in a parent selector like `.product-details-page`
3. **OR** make them more specific with compound selectors

## Additional Issues Found

1. **Duplicate Styles**: The same white text overrides appear in multiple places
2. **Missing @layer directives**: Consider using Tailwind's @layer components to control specificity
3. **No CSS isolation**: All styles are global, increasing chance of conflicts

## Testing Recommendations
After fixing:
1. Check product cards on the homepage
2. Check product cards in search results
3. Check product cards in category views
4. Verify product details page still looks correct
5. Test in both light and dark themes (if applicable)