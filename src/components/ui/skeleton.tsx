'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-muted/50',
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Preset skeleton components for common use cases

const SkeletonCard = () => (
  <div className="rounded-xl border bg-card p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

const SkeletonStat = () => (
  <div className="rounded-xl border bg-card p-4 space-y-2">
    <Skeleton className="h-3 w-16" />
    <Skeleton className="h-6 w-20" />
  </div>
);

const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-2/3' : 'w-full'
        )}
      />
    ))}
  </div>
);

const SkeletonButton = () => (
  <Skeleton className="h-10 w-24 rounded-lg" />
);

const SkeletonAvatar = ({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) => {
  const sizeClass = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];
  
  return <Skeleton className={cn('rounded-full', sizeClass)} />;
};

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonStat, 
  SkeletonText, 
  SkeletonButton, 
  SkeletonAvatar 
};
