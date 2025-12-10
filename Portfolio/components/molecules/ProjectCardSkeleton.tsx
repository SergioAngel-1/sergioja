'use client';

import SkeletonLoader from '../atoms/SkeletonLoader';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function ProjectCardSkeleton() {
  return (
    <div className="h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden p-4 sm:p-6 flex flex-col">
      {/* Image skeleton */}
      <div className="relative w-full aspect-video mb-4">
        <SkeletonLoader variant="image" />
      </div>

      {/* Title skeleton */}
      <div className="mb-2">
        <SkeletonLoader variant="title" width="80%" />
      </div>

      {/* Description skeleton */}
      <div className="mb-4 space-y-2">
        <SkeletonLoader variant="text" width="100%" />
        <SkeletonLoader variant="text" width="90%" />
      </div>

      {/* Tech badges skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <SkeletonLoader variant="button" width="60px" height="24px" />
        <SkeletonLoader variant="button" width="70px" height="24px" />
        <SkeletonLoader variant="button" width="55px" height="24px" />
        <SkeletonLoader variant="button" width="65px" height="24px" />
      </div>

      {/* Stats skeleton */}
      <div className="mt-auto grid grid-cols-3 gap-2">
        <div className="text-center">
          <SkeletonLoader variant="text" width="40px" height="20px" className="mx-auto mb-1" />
          <SkeletonLoader variant="text" width="60px" height="14px" className="mx-auto" />
        </div>
        <div className="text-center">
          <SkeletonLoader variant="text" width="40px" height="20px" className="mx-auto mb-1" />
          <SkeletonLoader variant="text" width="60px" height="14px" className="mx-auto" />
        </div>
        <div className="text-center">
          <SkeletonLoader variant="text" width="40px" height="20px" className="mx-auto mb-1" />
          <SkeletonLoader variant="text" width="60px" height="14px" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
