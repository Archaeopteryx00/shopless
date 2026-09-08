'use client';

import React from 'react';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { SearchBar } from '@/presentation/components/marketplace/SearchBar';
import { CategoryPills } from '@/presentation/components/marketplace/CategoryPills';
import { ProductCard } from '@/presentation/components/marketplace/ProductCard';
import { Compass } from 'lucide-react';

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
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-bold text-slate-900">Jelajah Katalog</h1>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Category Pills */}
      <CategoryPills activeCategory={category} onSelectCategory={setCategory} />

      {/* Products Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan {filteredProducts.length} barang</span>
        {category !== 'All' && (
          <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-medium">
            Kategori: {category}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-slate-500 border border-slate-200 shadow-xs">
          <p className="text-sm">Tidak ada barang yang sesuai pencarian.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategory('All');
            }}
            className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 min-w-0">
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
