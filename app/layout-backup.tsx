import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/navigation.css";
import "../styles/quickview.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
// import { Navigation } from "@/components/Navigation";
import { Analytics } from '@/components/Analytics';
import { Suspense } from 'react';
import { ServerStructuredData } from '@/components/ServerStructuredData';
import { CanonicalURL } from '@/components/CanonicalURL';
import { PerformanceOptimization } from '@/components/PerformanceOptimization';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ServiceWorkerManager } from '@/components/ServiceWorkerManager';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://arcompare.com' 
  : 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'AR Compare - Compare AR Glasses & Smart Glasses',
    template: '%s | AR Compare'
  },
  description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews for Xreal, Rokid, Viture, RayNeo, and more. Make informed decisions with our comprehensive AR product comparison tool.',
  keywords: [
    'AR glasses',
    'smart glasses',
    'augmented reality',
    'product comparison',
    'Xreal',
    'Rokid',
    'Viture',
    'RayNeo',
    'AR headset',
    'mixed reality',
    'XR glasses',
    'wearable tech'
  ],
  authors: [{ name: 'AR Compare Team' }],
  creator: 'AR Compare',
  publisher: 'AR Compare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'AR Compare - Compare AR Glasses & Smart Glasses',
    description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews for top brands.',
    siteName: 'AR Compare',
    images: [
      {
        url: '/api/placeholder/1200/630',
        width: 1200,
        height: 630,
        alt: 'AR Compare - Product Comparison Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AR Compare - Compare AR Glasses & Smart Glasses',
    description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews.',
    images: ['/api/placeholder/1200/630'],
    creator: '@arcompare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/api/placeholder/180/180" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Minimal essential styles only */}
        <style>{`
          * { box-sizing: border-box; }
          body { 
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            min-height: 100vh;
            line-height: 1.6;
          }
          .app-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
            color: white;
          }
          
          /* Critical fix: Ensure hidden elements don't block interactions */
          .hidden,
          [hidden],
          [aria-hidden="true"],
          *[style*="visibility: hidden"],
          *[style*="display: none"] {
            pointer-events: none !important;
          }
          
          /* Don't interfere with elements that are transitioning opacity */
          .transitioning {
            pointer-events: auto !important;
          }
          
          /* Fix quick view overlay blocking when closed */
          .quick-view-overlay:not(.open) {
            pointer-events: none !important;
            display: none !important;
          }
          
          /* Ensure dev tools are never blocked - comprehensive selectors */
          [data-nextjs-inspector],
          [data-nextjs-error-overlay],
          [data-nextjs-dialog-overlay],
          [data-nextjs-dialog-backdrop],
          [data-nextjs-portal],
          #__next-dev-tools-indicator,
          .nextjs-portal,
          nextjs-portal {
            z-index: 999999 !important;
            pointer-events: auto !important;
            position: fixed !important;
            isolation: isolate !important;
          }
          
          /* Ensure nothing can block dev tools */
          body > *:not([data-nextjs-inspector]):not([data-nextjs-error-overlay]):not([data-nextjs-dialog-overlay]):not(#__next-dev-tools-indicator):not(nextjs-portal) {
            max-z-index: 9998;
          }
        `}</style>
        <script src="/disable-sw.js"></script>
        <ServerStructuredData />
        <PerformanceOptimization 
          pageType="home"
          enableLazyLoading={true}
          enableCriticalCSS={true}
          enableResourceHints={true}
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ErrorBoundary>
          <ComparisonProvider>
            <CanonicalURL />
            <main id="main-content" tabIndex={-1}>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </ComparisonProvider>
        </ErrorBoundary>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ServiceWorkerManager />
      </body>
    </html>
  );
}