import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

interface TestResult {
  page: string;
  url: string;
  status: 'success' | 'error';
  screenshot?: string;
  issues: string[];
  loadTime: number;
  error?: string;
}

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function testPage(
  browser: Browser,
  pageName: string,
  url: string
): Promise<TestResult> {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  const issues: string[] = [];
  const startTime = Date.now();

  try {
    // Collect console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        issues.push(`Console error: ${msg.text()}`);
      }
    });

    // Collect page errors
    page.on('pageerror', (error) => {
      issues.push(`Page error: ${error.message}`);
    });

    // Navigate to page
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const loadTime = Date.now() - startTime;

    // Check response status
    if (response && response.status() >= 400) {
      issues.push(`HTTP ${response.status()} error`);
    }

    // Wait for content to render
    await page.waitForTimeout(1000);

    // Check for common rendering issues
    const renderingIssues = await page.evaluate(() => {
      const issues: string[] = [];

      // Check for elements with zero dimensions that should be visible
      const elementsToCheck = document.querySelectorAll(
        'main, header, footer, nav, section, article'
      );
      elementsToCheck.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          issues.push(`Element ${el.tagName} has zero dimensions`);
        }
      });

      // Check for overflow issues
      const body = document.body;
      if (body.scrollWidth > window.innerWidth + 10) {
        issues.push(
          `Horizontal overflow detected: ${body.scrollWidth}px > ${window.innerWidth}px`
        );
      }

      // Check for missing images
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          issues.push(`Broken image: ${img.src || 'no src'}`);
        }
      });

      // Check for text overflow/clipping
      const textElements = document.querySelectorAll('h1, h2, h3, p, span, a');
      textElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          style.overflow === 'hidden' &&
          el.scrollWidth > el.clientWidth + 5
        ) {
          const text = el.textContent?.substring(0, 30) || '';
          issues.push(`Text clipped: "${text}..."`);
        }
      });

      // Check for z-index stacking issues (elements that might be hidden)
      const fixedElements = document.querySelectorAll(
        '[style*="position: fixed"], [style*="position:fixed"]'
      );
      const stickyElements = document.querySelectorAll('.fixed, .sticky');

      // Check for very low contrast text (basic check)
      const lowContrastElements: string[] = [];
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;
        if (color.includes('rgba') && color.includes(', 0.')) {
          const opacity = parseFloat(color.split(', ').pop()?.replace(')', '') || '1');
          if (opacity < 0.4 && el.textContent?.trim()) {
            lowContrastElements.push(el.tagName);
          }
        }
      });
      if (lowContrastElements.length > 5) {
        issues.push(`${lowContrastElements.length} elements with potentially low contrast`);
      }

      // Check for layout shifts (elements outside viewport)
      const allElements = document.querySelectorAll('div, section, article');
      let outsideViewport = 0;
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.left < -100 || rect.right > window.innerWidth + 100) {
          outsideViewport++;
        }
      });
      if (outsideViewport > 10) {
        issues.push(`${outsideViewport} elements positioned outside viewport`);
      }

      return issues;
    });

    issues.push(...renderingIssues);

    // Take full page screenshot
    const screenshotName = `${pageName.replace(/[^a-z0-9]/gi, '-')}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await context.close();

    return {
      page: pageName,
      url,
      status: issues.length > 0 ? 'error' : 'success',
      screenshot: screenshotName,
      issues,
      loadTime,
    };
  } catch (error) {
    await context.close();
    return {
      page: pageName,
      url,
      status: 'error',
      issues,
      loadTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runTests(pages: { name: string; url: string }[]) {
  await ensureDir(SCREENSHOTS_DIR);

  const browser = await chromium.launch({ headless: true });
  const results: TestResult[] = [];

  console.log(`\nTesting ${pages.length} pages...\n`);

  for (const { name, url } of pages) {
    console.log(`Testing: ${name} (${url})`);
    const result = await testPage(browser, name, url);
    results.push(result);

    const status = result.status === 'success' ? '✓' : '✗';
    const issueCount = result.issues.length;
    console.log(
      `  ${status} ${result.loadTime}ms ${issueCount > 0 ? `(${issueCount} issues)` : ''}`
    );
    if (result.error) {
      console.log(`    Error: ${result.error}`);
    }
    result.issues.slice(0, 3).forEach((issue) => {
      console.log(`    - ${issue}`);
    });
  }

  await browser.close();

  // Write results to JSON
  const reportPath = path.join(SCREENSHOTS_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Summary
  console.log('\n=== SUMMARY ===');
  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  console.log(`Success: ${successCount}/${results.length}`);
  console.log(`With Issues: ${errorCount}/${results.length}`);
  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log(`Report saved to: ${reportPath}`);

  return results;
}

// Export for use by test runner
export { runTests, testPage };
export type { TestResult };
