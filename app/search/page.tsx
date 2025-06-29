import { Metadata } from 'next';
import { SearchPageClient } from './SearchPageClient';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  
  return {
    title: query ? `Search Results for "${query}" - AR Compare` : 'Search AR Glasses - AR Compare',
    description: query 
      ? `Find AR glasses matching "${query}". Compare specs, prices, and features of augmented reality devices.`
      : 'Search and compare AR glasses and smart glasses. Find the perfect augmented reality device for your needs.',
    keywords: `AR glasses search, ${query} AR glasses, smart glasses finder, AR compare`,
    robots: query ? 'index, follow' : 'noindex, follow',
    openGraph: {
      title: query ? `Search: ${query} - AR Compare` : 'Search AR Glasses',
      description: `Search results for AR glasses${query ? ` matching "${query}"` : ''}.`,
      type: 'website',
      url: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  return <SearchPageClient searchParams={params} />;
}