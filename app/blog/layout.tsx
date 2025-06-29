import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AR Glasses Blog - Expert Reviews & Guides',
    template: '%s | AR Compare Blog'
  },
  description: 'Expert AR glasses content including reviews, buying guides, technology analysis, and industry insights.',
  keywords: 'AR glasses blog, smart glasses reviews 2024, augmented reality guides, AR technology insights, best AR glasses, AR glasses buying guide',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AR Compare',
  },
  twitter: {
    card: 'summary_large_image',
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
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}