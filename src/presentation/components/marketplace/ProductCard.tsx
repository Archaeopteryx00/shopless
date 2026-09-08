'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/domain/models/Product';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export function formatIDR(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative glass-panel rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5">
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-4 left-4 z-30 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-md">
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist?.(product.id);
        }}
        className={`absolute top-4 right-4 z-30 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
          isWishlisted
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
            : 'bg-slate-900/60 text-slate-400 hover:text-rose-400 border border-slate-700/50'
        }`}
        aria-label="Toggle wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
        {/* Product Image Thumbnail */}
        <div className="w-full aspect-square mb-3">
          <ProductImage
            category={product.category}
            name={product.name}
            className="w-full h-full"
            size="md"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 mb-1 block">
              {product.category}
            </span>
            <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 flex flex-col gap-1">
            {/* Rating & Review count */}
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal text-[10px]">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-white tracking-tight">
                {formatIDR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-slate-500 line-through">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
