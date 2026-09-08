'use client';

import React from 'react';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { ProductCard } from '@/presentation/components/marketplace/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistedProducts, loading, isWishlisted, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-xs">
        Loading saved items...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
        <h1 className="text-lg font-bold text-slate-100">Saved Wishlist</h1>
        <span className="ml-auto text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
          {wishlistedProducts.length} items
        </span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-400 my-6 flex flex-col items-center gap-3">
          <Heart className="w-10 h-10 text-slate-600 stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Your wishlist is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Save interesting items while browsing to reflect on them before simulating a purchase.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={isWishlisted(product.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
