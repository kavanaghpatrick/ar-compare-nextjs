import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals-simple.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
// import { Navigation } from "@/components/Navigation";
import { Analytics } from '@/components/Analytics';
import { ServerStructuredData } from '@/components/ServerStructuredData';
import { CanonicalURL } from '@/components/CanonicalURL';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://ar-compare.com' 
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
        url: '/og-image.jpg',
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
    images: ['/twitter-image.jpg'],
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
        <ServerStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ComparisonProvider>
          <CanonicalURL />
          {children}
        </ComparisonProvider>
        <Analytics />
      </body>
    </html>
  );
}