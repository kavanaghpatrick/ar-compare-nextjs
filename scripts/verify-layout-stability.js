#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Layout Stability Implementation...\n');

// Components that should be using OptimizedImage
const componentsToCheck = [
  'components/ProductCard.tsx',
  'components/ProductHero.tsx',
  'components/BlogPostClient.tsx',
  'components/SimilarProducts.tsx',
  'components/QuickView.tsx',
  'components/ProductComparison.tsx',
  'components/BlogListingOptimized.tsx'
];

// Check if components import and use OptimizedImage
let allPassed = true;

componentsToCheck.forEach(component => {
  const filePath = path.join(process.cwd(), component);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for OptimizedImage import
    const hasImport = content.includes("import { OptimizedImage }") || 
                     content.includes("import OptimizedImage");
    
    // Check for usage with required width/height
    const hasUsage = content.includes("<OptimizedImage");
    
    // Check for any remaining img tags
    const hasImgTags = content.includes("<img ");
    
    console.log(`✅ ${component}:`);
    console.log(`   - OptimizedImage import: ${hasImport ? '✓' : '✗'}`);
    console.log(`   - OptimizedImage usage: ${hasUsage ? '✓' : '✗'}`);
    console.log(`   - No <img> tags: ${!hasImgTags ? '✓' : '✗ WARNING: Found <img> tags'}`);
    
    if (!hasImport || !hasUsage || hasImgTags) {
      allPassed = false;
    }
    
  } catch (error) {
    console.log(`❌ ${component}: File not found`);
    allPassed = false;
  }
  
  console.log('');
});

// Check skeleton components exist
console.log('🦴 Checking Skeleton Components:\n');

const skeletonComponents = [
  'components/skeletons/ProductCardSkeleton.tsx',
  'components/skeletons/ProductHeroSkeleton.tsx',
  'components/skeletons/BlogPostSkeleton.tsx',
  'components/skeletons/index.ts'
];

skeletonComponents.forEach(skeleton => {
  const filePath = path.join(process.cwd(), skeleton);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${skeleton}`);
  if (!exists) allPassed = false;
});

// Check OptimizedImage component requirements
console.log('\n🖼️  Checking OptimizedImage Component:\n');

const optimizedImagePath = path.join(process.cwd(), 'components/OptimizedImage.tsx');
try {
  const content = fs.readFileSync(optimizedImagePath, 'utf8');
  
  // Check for required width/height props
  const hasRequiredWidth = content.includes('width: number; // Required');
  const hasRequiredHeight = content.includes('height: number; // Required');
  const hasAspectRatio = content.includes('aspectRatio?: boolean;');
  
  console.log(`   - Required width prop: ${hasRequiredWidth ? '✓' : '✗'}`);
  console.log(`   - Required height prop: ${hasRequiredHeight ? '✓' : '✗'}`);
  console.log(`   - AspectRatio support: ${hasAspectRatio ? '✓' : '✗'}`);
  
  if (!hasRequiredWidth || !hasRequiredHeight || !hasAspectRatio) {
    allPassed = false;
  }
} catch (error) {
  console.log('❌ OptimizedImage.tsx not found');
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All layout stability checks passed!');
  console.log('\nNext steps:');
  console.log('1. Run `npm run dev` and test the /test-images page');
  console.log('2. Run Lighthouse to verify CLS < 0.1');
  console.log('3. Test responsive behavior on different screen sizes');
} else {
  console.log('❌ Some checks failed. Please review the output above.');
}
console.log('='.repeat(50) + '\n');