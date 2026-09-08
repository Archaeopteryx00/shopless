'use client';

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="card-marketplace p-3 flex flex-col justify-between animate-pulse">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3" />
      <div className="flex flex-col gap-2">
        <div className="w-16 h-3 bg-slate-200 rounded" />
        <div className="w-full h-4 bg-slate-200 rounded" />
        <div className="w-3/4 h-4 bg-slate-200 rounded" />
        <div className="w-1/2 h-5 bg-slate-200 rounded mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse p-2">
      <div className="w-full aspect-square bg-slate-200 rounded-2xl" />
      <div className="w-20 h-4 bg-slate-200 rounded" />
      <div className="w-full h-6 bg-slate-200 rounded" />
      <div className="w-32 h-7 bg-slate-200 rounded" />
      <div className="w-full h-20 bg-slate-200 rounded-xl" />
      <div className="w-full h-12 bg-slate-200 rounded-xl" />
    </div>
  );
}
