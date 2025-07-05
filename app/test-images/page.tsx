'use client';

import { OptimizedImage } from '@/components/OptimizedImage';
import { ProductCardSkeleton, ProductHeroSkeleton, BlogPostSkeleton } from '@/components/skeletons';

export default function TestImagesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Image Component Test Page</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">OptimizedImage Tests</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg mb-2">Fixed Dimensions (400x300)</h3>
            <OptimizedImage
              src="/api/placeholder/400/300"
              alt="Fixed dimension test"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
          
          <div>
            <h3 className="text-lg mb-2">Aspect Ratio Container</h3>
            <OptimizedImage
              src="/api/placeholder/600/400"
              alt="Aspect ratio test"
              width={600}
              height={400}
              aspectRatio
              className="rounded-lg"
            />
          </div>
          
          <div>
            <h3 className="text-lg mb-2">Fill Container</h3>
            <div className="relative h-64">
              <OptimizedImage
                src="/api/placeholder/800/600"
                alt="Fill test"
                width={800}
                height={600}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Skeleton Loaders</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg mb-4">ProductCardSkeleton</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">ProductHeroSkeleton</h3>
            <ProductHeroSkeleton />
          </div>
          
          <div>
            <h3 className="text-lg mb-4">BlogPostSkeleton</h3>
            <BlogPostSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}