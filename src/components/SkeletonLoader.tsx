import React from 'react';

/**
 * Animated Shimmer Skeleton for Product Cards in Marketplace & Catalog
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm p-3.5 space-y-3 animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-44 bg-slate-200 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between pt-1">
        <div className="w-16 h-4 bg-slate-200 rounded-full" />
        <div className="w-10 h-4 bg-slate-200 rounded-full" />
      </div>

      {/* Title */}
      <div className="w-3/4 h-5 bg-slate-200 rounded-lg" />

      {/* Subtitle / Producer */}
      <div className="w-1/2 h-3.5 bg-slate-100 rounded-md" />

      {/* Bottom price and button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="w-16 h-6 bg-slate-200 rounded-md" />
        <div className="w-24 h-8 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Grid of Product Skeletons
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Skeleton for Vendor Cards
 */
export const VendorCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="w-3/4 h-5 bg-slate-200 rounded-lg" />
          <div className="w-1/2 h-3.5 bg-slate-100 rounded-md" />
        </div>
      </div>
      <div className="w-full h-12 bg-slate-100 rounded-xl" />
      <div className="flex gap-2">
        <div className="w-20 h-6 bg-slate-200 rounded-full" />
        <div className="w-20 h-6 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Generic Shimmer Loading Spinner for Buttons & Actions
 */
export const ButtonSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 16, 
  className = "text-white" 
}) => {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  );
};
