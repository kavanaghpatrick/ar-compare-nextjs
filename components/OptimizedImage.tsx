'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder for better UX
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f3f4f6" offset="20%" />
          <stop stop-color="#e5e7eb" offset="50%" />
          <stop stop-color="#f3f4f6" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f3f4f6" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  // Handle API placeholder URLs
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('/api/placeholder/')) {
      // Convert API placeholder to actual image service
      // const dimensions = originalSrc.split('/').pop();
      return `https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=${width}&h=${height}&fit=crop&auto=format&q=${quality}`;
    }
    return originalSrc;
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400",
          !fill && `w-[${width}px] h-[${height}px]`,
          fill && "absolute inset-0",
          className
        )}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", !fill && "inline-block")}>
      <Image
        src={getOptimizedSrc(src)}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes || (fill ? "100vw" : `${width}px`)}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || (placeholder === 'blur' ? defaultBlurDataURL : undefined)}
        className={cn(
          "transition-all duration-300",
          isLoading ? "scale-110 blur-sm" : "scale-100 blur-0",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setHasError(true);
          setLoading(false);
        }}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse",
            !fill && `w-[${width}px] h-[${height}px]`
          )}
        />
      )}
    </div>
  );
}