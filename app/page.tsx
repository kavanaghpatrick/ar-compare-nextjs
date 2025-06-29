import { Metadata } from 'next';
import { Suspense } from 'react';
// import { HomeClient } from '@/components/HomeClient';
// import { SafeHomeClient as HomeClient } from '@/components/SafeHomeClient';
// import { HomeClientErrorBoundary as HomeClient } from '@/components/HomeClientErrorBoundary';
// import { HomeClientImmediate as HomeClient } from '@/components/HomeClientImmediate';
import { HomeClientEnhanced as HomeClient } from '@/components/HomeClientEnhanced';
import arGlassesData from '@/data/products';
import { SimpleLoading } from '@/components/SimpleLoading';

// Generate metadata for SEO
export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  
  let title = 'Best AR Glasses 2024 - Compare 15+ Models | AR Compare';
  let description = 'Find the perfect AR glasses with our comprehensive comparison of 15+ models. Compare specs, prices, and reviews from Xreal, RayNeo, and more. Updated daily.';
  
  if (search) {
    title = `"${search}" AR Glasses - Compare Models & Prices | AR Compare`;
    description = `Find AR glasses matching "${search}". Compare specs, real-time pricing, and verified reviews. Make the right choice with expert analysis.`;
  } else if (category) {
    title = `Best ${category} AR Glasses 2024 - Compare Top Models`;
    description = `Compare the best ${category.toLowerCase()} AR glasses. See specs, prices, and user reviews to find your perfect gaming companion. Expert-tested recommendations.`;
  }
  
  return {
    title,
    description,
    keywords: 'AR glasses comparison, best AR glasses 2024, smart glasses review, augmented reality glasses, Xreal One Pro, RayNeo X3 Pro, Viture One, AR glasses buying guide, AR headset comparison, mixed reality glasses',
    openGraph: {
      title,
      description,
      url: 'https://arcompare.com',
      siteName: 'AR Compare',
      images: [
        {
          url: '/api/placeholder/1200/630',
          width: 1200,
          height: 630,
          alt: 'AR Compare - Compare AR Glasses'
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/api/placeholder/1200/630'],
    },
    alternates: {
      canonical: 'https://arcompare.com',
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
}

// Server component that fetches data
export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  // This runs on the server - we can do data fetching here if needed
  const initialProducts = arGlassesData;
  const params = await searchParams;
  
  // Pass server data to client component wrapped in Suspense
  return (
    <Suspense fallback={<SimpleLoading />}>
      <HomeClient 
        initialProducts={initialProducts}
        searchParams={params}
      />
    </Suspense>
  );
}