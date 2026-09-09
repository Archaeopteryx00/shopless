'use client';

import React from 'react';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { ProductCard } from './ProductCard';
import { ProductCategory, Product } from '@/domain/models/Product';
import { Sparkles } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId: string;
  category: ProductCategory;
}

export function ProductRecommendations({ currentProductId, category }: ProductRecommendationsProps) {
  const { allProducts } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Find same category products first, then other products, excluding current
  const sameCategoryProducts = allProducts.filter(
    (p: Product) => p.id !== currentProductId && p.category === category
  );

  const otherProducts = allProducts.filter(
    (p: Product) => p.id !== currentProductId && p.category !== category
  );

  // Take top 4 recommended items
  const recommended: Product[] = [...sameCategoryProducts, ...otherProducts].slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Saran Produk Serupa
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-normal">Pilihan Terkait</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {recommended.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
