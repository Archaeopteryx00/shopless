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
  // Format as Indonesian Rupiah "Rp 799.000"
  const formatted = new Intl.NumberFormat('id-ID').format(price);
  return `Rp ${formatted}`;
}

export function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative card-marketplace p-2.5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300">
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-3 left-3 z-20 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
          {discountPercent}%
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
        className={`absolute top-3 right-3 z-20 p-1.5 rounded-full transition-all duration-200 ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-200 shadow-xs'
        }`}
        aria-label="Simpan Wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
        {/* Product Image Thumbnail */}
        <div className="w-full aspect-square mb-2.5">
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
            <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-col gap-1">
            {/* Price section */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {formatIDR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-slate-400 line-through">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Rating & Review count */}
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal text-[10px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
