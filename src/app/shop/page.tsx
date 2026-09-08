'use client';

import React from 'react';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { SearchBar } from '@/presentation/components/marketplace/SearchBar';
import { CategoryPills } from '@/presentation/components/marketplace/CategoryPills';
import { ProductCard } from '@/presentation/components/marketplace/ProductCard';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  const {
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
  } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-slate-100">Browse Marketplace</h1>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Category Pills */}
      <CategoryPills activeCategory={category} onSelectCategory={setCategory} />

      {/* Products Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Showing {filteredProducts.length} items</span>
        {category !== 'All' && (
          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20 font-medium">
            Category: {category}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
          <p className="text-sm">No items found matching your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('All');
            }}
            className="mt-3 text-xs text-blue-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
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
