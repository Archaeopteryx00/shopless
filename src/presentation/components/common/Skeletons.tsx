'use client';

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="card-marketplace p-2.5 flex flex-col justify-between animate-pulse motion-reduce:animate-none min-h-[220px]">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-2.5" />
      <div className="flex flex-col flex-1 justify-between gap-2">
        <div className="w-full h-3.5 bg-slate-200 rounded" />
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-col gap-1.5">
          <div className="w-20 h-4 bg-slate-200 rounded" />
          <div className="w-12 h-3 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 min-w-0">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse motion-reduce:animate-none pb-6">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-1" />
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 bg-slate-200 rounded-md" />
        <div className="w-24 h-4 bg-slate-200 rounded" />
      </div>
      <div className="w-3/4 h-6 bg-slate-200 rounded" />
      <div className="w-32 h-8 bg-slate-200 rounded pt-1" />
      <div className="w-full h-24 bg-slate-200 rounded-xl" />
      <div className="w-full h-12 bg-slate-200 rounded-xl mt-2" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3 animate-pulse motion-reduce:animate-none">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3"
        >
          <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-3/4 h-4 bg-slate-200 rounded" />
            <div className="w-1/3 h-3 bg-slate-200 rounded" />
            <div className="w-20 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
