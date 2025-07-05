import { Suspense } from 'react';
import { HomeClient } from '@/components/HomeClient';
import arGlassesData from '@/data/products';

export default async function DebugPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  console.log('[DebugPage] Server component rendering...');
  
  const params = await searchParams;
  console.log('[DebugPage] Search params:', params);
  console.log('[DebugPage] Products available:', arGlassesData?.length);
  
  return (
    <Suspense fallback={<div>Loading from Suspense...</div>}>
      <HomeClient 
        initialProducts={arGlassesData}
        searchParams={params}
      />
    </Suspense>
  );
}