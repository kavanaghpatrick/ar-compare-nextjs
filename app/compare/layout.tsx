import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare AR Glasses - Side by Side Comparison',
  description: 'Compare AR glasses and smart glasses side by side. Detailed specifications, prices, features, and reviews to help you choose the perfect AR headset.',
  keywords: [
    'AR glasses comparison',
    'smart glasses compare',
    'augmented reality comparison',
    'AR headset comparison',
    'side by side comparison',
    'AR glasses specs',
    'best AR glasses',
    'AR glasses review'
  ],
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'Compare AR Glasses - Side by Side Comparison',
    description: 'Compare AR glasses and smart glasses side by side with detailed specifications and reviews.',
    type: 'website',
    url: process.env.NODE_ENV === 'production' ? 'https://ar-compare.com/compare' : 'http://localhost:3000/compare',
    images: [
      {
        url: '/og-compare.jpg',
        width: 1200,
        height: 630,
        alt: 'AR Compare - Product Comparison Tool',
      },
    ],
    siteName: 'AR Compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare AR Glasses - Side by Side Comparison',
    description: 'Compare AR glasses and smart glasses side by side with detailed specifications.',
    images: ['/twitter-compare.jpg'],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}