import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Re-enabled ESLint during builds for code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['placeholder.com', 'via.placeholder.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // SEO optimizations
  generateBuildId: async () => {
    // Use current timestamp for build ID to ensure fresh deployments
    return `build-${Date.now()}`;
  },
  
  // Compression
  compress: true,
  
  // Headers for performance and security
  async headers() {
    return [
      // Blog-specific optimizations
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Link',
            value: '</blog/feed.xml>; rel="alternate"; type="application/rss+xml"; title="AR Compare Blog RSS Feed"',
          },
        ],
      },
      // RSS Feed caching
      {
        source: '/blog/feed.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/rss+xml; charset=utf-8',
          },
        ],
      },
      // Sitemap caching
      {
        source: '/sitemap-blog.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // FIXED: Removed 'unsafe-eval' to prevent XSS attacks
              // Using 'unsafe-inline' is still needed for Next.js inline scripts but we should migrate to nonces
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
              "media-src 'self'",
              "object-src 'none'",
              "child-src 'self'",
              "frame-src 'self'",
              "worker-src 'self' blob:",
              "form-action 'self'",
              "base-uri 'self'",
              "manifest-src 'self'",
              "prefetch-src 'self'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|gif|png|svg|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Enable bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),
};

export default nextConfig;
