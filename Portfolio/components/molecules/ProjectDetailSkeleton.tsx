'use client';

import SkeletonLoader from '../atoms/SkeletonLoader';

export default function ProjectDetailSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Back button skeleton */}
        <div className="mb-6 sm:mb-8">
          <SkeletonLoader variant="button" width="120px" height="40px" />
        </div>

        {/* Title skeleton */}
        <div className="mb-6">
          <SkeletonLoader variant="title" width="60%" height="48px" className="mb-4" />
          <SkeletonLoader variant="text" width="80%" />
          <SkeletonLoader variant="text" width="70%" className="mt-2" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <SkeletonLoader variant="text" width="60px" height="24px" className="mb-2" />
              <SkeletonLoader variant="text" width="80px" height="16px" />
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Preview section - 75% */}
          <div className="lg:col-span-9">
            <SkeletonLoader variant="image" className="w-full" style={{ height: '600px' }} />
          </div>

          {/* Gallery section - 25% */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} variant="image" className="w-full aspect-video" />
              ))}
            </div>
          </div>
        </div>

        {/* Tech stack skeleton */}
        <div className="mt-8">
          <SkeletonLoader variant="title" width="200px" className="mb-4" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonLoader key={i} variant="button" width="80px" height="32px" />
            ))}
          </div>
        </div>

        {/* Related projects skeleton */}
        <div className="mt-12">
          <SkeletonLoader variant="title" width="250px" className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <SkeletonLoader variant="image" className="mb-4" />
                <SkeletonLoader variant="title" width="70%" className="mb-2" />
                <SkeletonLoader variant="text" width="100%" />
                <SkeletonLoader variant="text" width="90%" className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
