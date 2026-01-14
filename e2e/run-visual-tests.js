const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

const ALL_PAGES = [
  // Homepage
  { name: '01-homepage', url: 'http://localhost:3000' },

  // Products
  { name: '02-product-xreal-one-pro', url: 'http://localhost:3000/products/xreal-one-pro' },
  { name: '02-product-viture-pro-xr', url: 'http://localhost:3000/products/viture-pro-xr' },
  { name: '02-product-meta-ray-ban', url: 'http://localhost:3000/products/meta-ray-ban-wayfarer' },
  { name: '02-product-rokid', url: 'http://localhost:3000/products/rokid-ar-spatial' },

  // Compare
  { name: '03-compare', url: 'http://localhost:3000/compare' },

  // Blog
  { name: '04-blog-listing', url: 'http://localhost:3000/blog' },
  { name: '04-blog-guide', url: 'http://localhost:3000/blog/ultimate-guide-choosing-ar-glasses-2024' },

  // Categories
  { name: '05-category-premium', url: 'http://localhost:3000/category/premium' },
  { name: '05-category-budget', url: 'http://localhost:3000/category/budget' },

  // Brands
  { name: '06-brand-listing', url: 'http://localhost:3000/brand' },
  { name: '06-brand-xreal', url: 'http://localhost:3000/brand/xreal' },

  // Search
  { name: '07-search-empty', url: 'http://localhost:3000/search' },
  { name: '07-search-results', url: 'http://localhost:3000/search?q=xreal' },

  // Market Analysis
  { name: '08-market-analysis', url: 'http://localhost:3000/market-analysis' },

  // Reviews
  { name: '09-reviews', url: 'http://localhost:3000/reviews' },

  // Mobile viewport tests
  { name: '10-mobile-home', url: 'http://localhost:3000', mobile: true },
  { name: '10-mobile-product', url: 'http://localhost:3000/products/xreal-one-pro', mobile: true },
  { name: '10-mobile-blog', url: 'http://localhost:3000/blog', mobile: true },
];

async function testPage(browser, pageConfig) {
  const viewport = pageConfig.mobile
    ? { width: 375, height: 812 }
    : { width: 1920, height: 1080 };

  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const issues = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push(`Console error: ${msg.text().substring(0, 150)}`);
    }
  });

  page.on('pageerror', err => {
    issues.push(`Page error: ${err.message.substring(0, 150)}`);
  });

  const result = {
    name: pageConfig.name,
    url: pageConfig.url,
    mobile: !!pageConfig.mobile,
    issues: [],
    status: 'success',
    loadTime: 0,
  };

  try {
    const start = Date.now();
    const response = await page.goto(pageConfig.url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    result.loadTime = Date.now() - start;

    if (response && response.status() >= 400) {
      issues.push(`HTTP ${response.status()} error`);
    }

    // Wait for content
    await page.waitForTimeout(500);

    // Check for rendering issues
    const renderIssues = await page.evaluate(() => {
      const issues = [];

      // Horizontal overflow
      if (document.body.scrollWidth > window.innerWidth + 10) {
        issues.push(`Horizontal overflow: ${document.body.scrollWidth}px > ${window.innerWidth}px`);
      }

      // Broken images
      const images = document.querySelectorAll('img');
      let brokenCount = 0;
      images.forEach(img => {
        if (img.src && !img.complete) brokenCount++;
        if (img.src && img.naturalWidth === 0 && img.complete) brokenCount++;
      });
      if (brokenCount > 0) {
        issues.push(`${brokenCount} broken images`);
      }

      // Zero-height sections
      const sections = document.querySelectorAll('section, main, article');
      sections.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 && el.children.length > 0) {
          issues.push(`Empty section found`);
        }
      });

      // Check for overlapping fixed elements
      const fixedElements = document.querySelectorAll('.fixed, [style*="position: fixed"]');
      if (fixedElements.length > 3) {
        issues.push(`${fixedElements.length} fixed elements (potential z-index issues)`);
      }

      // Text clipping check
      let clippedCount = 0;
      document.querySelectorAll('h1, h2, h3, h4, p').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 5) {
          clippedCount++;
        }
      });
      if (clippedCount > 3) {
        issues.push(`${clippedCount} elements with text overflow`);
      }

      return issues;
    });

    issues.push(...renderIssues);

    // Take screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageConfig.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    result.issues = issues;
    result.status = issues.length > 0 ? 'issues' : 'success';

  } catch (err) {
    result.status = 'error';
    result.error = err.message;
    issues.push(`Error: ${err.message}`);
    result.issues = issues;
  }

  await context.close();
  return result;
}

async function runAllTests() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Starting visual tests for', ALL_PAGES.length, 'pages...\n');

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const pageConfig of ALL_PAGES) {
    process.stdout.write(`Testing ${pageConfig.name}... `);
    const result = await testPage(browser, pageConfig);
    results.push(result);

    const icon = result.status === 'success' ? '✓' : result.status === 'issues' ? '⚠' : '✗';
    console.log(`${icon} ${result.loadTime}ms ${result.issues.length > 0 ? `(${result.issues.length} issues)` : ''}`);

    if (result.issues.length > 0) {
      result.issues.slice(0, 3).forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VISUAL TEST SUMMARY');
  console.log('='.repeat(60));

  const success = results.filter(r => r.status === 'success').length;
  const withIssues = results.filter(r => r.status === 'issues').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log(`✓ Clean: ${success}/${results.length}`);
  console.log(`⚠ With Issues: ${withIssues}/${results.length}`);
  console.log(`✗ Errors: ${errors}/${results.length}`);

  console.log('\nPages with issues:');
  results.filter(r => r.issues.length > 0).forEach(r => {
    console.log(`\n  ${r.name} (${r.url})`);
    r.issues.forEach(issue => {
      console.log(`    - ${issue}`);
    });
  });

  // Save report
  const reportPath = path.join(SCREENSHOTS_DIR, 'visual-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);

  return results;
}

runAllTests().catch(console.error);
