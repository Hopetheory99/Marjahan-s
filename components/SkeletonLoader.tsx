import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses =
    'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    card: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="card-luxury h-full">
    {/* Image Skeleton */}
    <div className="aspect-square bg-brand-cream relative overflow-hidden">
      <Skeleton variant="rectangular" className="w-full h-full" />
      {/* Stock badge skeleton */}
      <Skeleton
        variant="rectangular"
        width={80}
        height={24}
        className="absolute bottom-3 left-3 rounded-full"
      />
    </div>

    {/* Content Skeleton */}
    <div className="p-6">
      {/* Title */}
      <Skeleton variant="text" height={20} className="mb-2" />
      <Skeleton variant="text" width="60%" height={20} className="mb-2" />

      {/* Price */}
      <Skeleton variant="text" width={60} height={24} className="mb-2" />

      {/* Metal type */}
      <div className="flex items-center justify-center space-x-2 mb-3">
        <Skeleton width={12} height={1} />
        <Skeleton variant="text" width={80} height={12} />
        <Skeleton width={12} height={1} />
      </div>

      {/* View details hint */}
      <Skeleton variant="text" width={100} height={12} />
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Hero Section Skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="relative h-screen bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
    <div className="absolute inset-0 bg-black/20" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
      {/* Logo skeleton */}
      <Skeleton variant="text" width={200} height={40} className="mb-8" />

      {/* Title skeleton */}
      <Skeleton variant="text" width={400} height={60} className="mb-6" />
      <Skeleton variant="text" width={300} height={24} className="mb-8" />

      {/* Decorative elements */}
      <div className="flex space-x-2 mb-12">
        <Skeleton width={16} height={1} />
        <Skeleton width={16} height={1} />
      </div>

      {/* Button skeleton */}
      <Skeleton variant="rectangular" width={200} height={50} className="rounded-full" />
    </div>

    {/* Scroll indicator skeleton */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <Skeleton variant="circular" width={24} height={40} />
    </div>
  </div>
);

// Search Results Skeleton
export const SearchResultsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Search bar skeleton */}
    <div className="max-w-2xl mx-auto">
      <Skeleton variant="rectangular" height={56} className="rounded-xl" />
    </div>

    {/* Filters skeleton */}
    <div className="bg-white dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <Skeleton variant="text" width={60} height={16} className="mb-2" />
            <Skeleton variant="rectangular" height={40} className="rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Results count skeleton */}
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width={120} height={20} />
      <Skeleton variant="text" width={80} height={20} />
    </div>

    {/* Product grid skeleton */}
    <ProductGridSkeleton count={12} />
  </div>
);

// Profile Page Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    {/* Header */}
    <div className="text-center">
      <Skeleton variant="circular" width={120} height={120} className="mx-auto mb-4" />
      <Skeleton variant="text" width={200} height={32} className="mx-auto mb-2" />
      <Skeleton variant="text" width={150} height={20} className="mx-auto" />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-brand-cream dark:border-dark-border"
        >
          <Skeleton variant="text" width={100} height={24} className="mb-2" />
          <Skeleton variant="text" width={60} height={32} />
        </div>
      ))}
    </div>

    {/* Content sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-brand-cream dark:border-dark-border">
        <Skeleton variant="text" width={120} height={24} className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={48} className="rounded-lg" />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-brand-cream dark:border-dark-border">
        <Skeleton variant="text" width={120} height={24} className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} className="rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Checkout Skeleton
export const CheckoutSkeleton: React.FC = () => (
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
    {/* Form section */}
    <div className="space-y-8">
      <div>
        <Skeleton variant="text" width={150} height={28} className="mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i}>
              <Skeleton variant="text" width={80} height={16} className="mb-2" />
              <Skeleton variant="rectangular" height={44} className="rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton variant="text" width={120} height={28} className="mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={44} className="rounded-lg" />
          ))}
        </div>
      </div>
    </div>

    {/* Order summary */}
    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl border border-brand-cream dark:border-dark-border h-fit">
      <Skeleton variant="text" width={140} height={24} className="mb-6" />

      <div className="space-y-4 mb-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton variant="text" width={120} height={16} />
            <Skeleton variant="text" width={60} height={16} />
          </div>
        ))}
      </div>

      <Skeleton variant="rectangular" height={1} className="mb-4" />

      <div className="flex justify-between mb-6">
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={70} height={20} />
      </div>

      <Skeleton variant="rectangular" height={48} className="rounded-lg" />
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="bg-white dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-xl overflow-hidden">
    {/* Table header */}
    <div className="border-b border-brand-cream dark:border-dark-border p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} variant="text" height={16} />
        ))}
      </div>
    </div>

    {/* Table rows */}
    <div className="divide-y divide-brand-cream dark:divide-dark-border">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
