'use client';

import React from 'react';

export function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 pt-8 mb-6">
        <div className="h-4 w-12 bg-gray-700/30 rounded"></div>
        <div className="h-4 w-2 bg-gray-700/30 rounded"></div>
        <div className="h-4 w-12 bg-gray-700/30 rounded"></div>
        <div className="h-4 w-2 bg-gray-700/30 rounded"></div>
        <div className="h-4 w-32 bg-gray-700/30 rounded"></div>
      </div>

      {/* Header skeleton */}
      <header className="mb-12">
        {/* Category badge */}
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-700/30 rounded-full"></div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div className="h-12 w-full bg-gray-700/30 rounded-md"></div>
          <div className="h-12 w-3/4 bg-gray-700/30 rounded-md"></div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2 mb-8">
          <div className="h-6 w-full bg-gray-700/30 rounded-md"></div>
          <div className="h-6 w-5/6 bg-gray-700/30 rounded-md"></div>
        </div>

        {/* Author and meta info */}
        <div className="py-6 border-y border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700/30 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-700/30 rounded"></div>
                <div className="h-3 w-32 bg-gray-700/30 rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-4 w-24 bg-gray-700/30 rounded"></div>
              <div className="h-4 w-20 bg-gray-700/30 rounded"></div>
              <div className="h-4 w-16 bg-gray-700/30 rounded"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured image skeleton with exact dimensions */}
      <div className="mb-12">
        <div className="aspect-video bg-gray-700/30 rounded-xl animate-pulse"></div>
      </div>

      {/* Article content skeleton */}
      <article className="mb-16">
        <div className="space-y-4">
          {/* Paragraphs */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-full bg-gray-700/30 rounded"></div>
              {i % 3 === 0 && <div className="h-5 w-5/6 bg-gray-700/30 rounded"></div>}
              {i % 3 === 1 && <div className="h-5 w-4/5 bg-gray-700/30 rounded"></div>}
              {i % 3 === 2 && <div className="h-5 w-3/4 bg-gray-700/30 rounded"></div>}
            </div>
          ))}

          {/* Heading in middle */}
          <div className="h-7 w-1/2 bg-gray-700/30 rounded mt-8 mb-4"></div>

          {/* More paragraphs */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-5 w-full bg-gray-700/30 rounded"></div>
          ))}
        </div>

        {/* Tags skeleton */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="h-5 w-16 bg-gray-700/30 rounded mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-700/30 rounded-full"></div>
            ))}
          </div>
        </div>
      </article>

      {/* Author bio skeleton */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/10 p-8">
          <div className="h-6 w-40 bg-gray-700/30 rounded mb-4"></div>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-700/30 rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-gray-700/30 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-700/30 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-700/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RelatedPostsSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-16">
      <div className="h-8 w-48 bg-gray-700/30 rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <article key={i} className="product-card animate-pulse">
            {/* Image skeleton with exact aspect ratio */}
            <div className="aspect-video bg-gray-700/30 rounded-lg mb-4"></div>
            
            {/* Meta info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-5 w-20 bg-gray-700/30 rounded-full"></div>
              <div className="h-4 w-16 bg-gray-700/30 rounded"></div>
            </div>
            
            {/* Title */}
            <div className="space-y-2 mb-3">
              <div className="h-5 w-full bg-gray-700/30 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-700/30 rounded"></div>
            </div>
            
            {/* Excerpt */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700/30 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-700/30 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-700/30 rounded"></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}