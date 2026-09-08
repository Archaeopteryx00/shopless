'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useSession } from '@/presentation/hooks/useSession';
import { useOrders } from '@/presentation/hooks/useOrders';
import { HeroBanner } from '@/presentation/components/marketplace/HeroBanner';
import { SearchBar } from '@/presentation/components/marketplace/SearchBar';
import { CategoryPills } from '@/presentation/components/marketplace/CategoryPills';
import { ProductCard } from '@/presentation/components/marketplace/ProductCard';
import { TriggerModal } from '@/presentation/components/marketplace/TriggerModal';
import { DeliveryBanner } from '@/presentation/components/shipping/DeliveryBanner';
import { ProductGridSkeleton } from '@/presentation/components/common/Skeletons';
import { Flame, Sparkles, ArrowRight, Layers } from 'lucide-react';

export default function HomePage() {
  const {
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    deals,
    popular,
    forYou,
  } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showTriggerModal, selectTrigger, skipTrigger } = useSession();
  const { deliveredOrdersCount } = useOrders();

  const isSearchingOrFiltering = searchQuery.trim() !== '' || category !== 'All';

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Shopping Motivation Trigger Modal */}
      <TriggerModal
        isOpen={showTriggerModal}
        onSelectTrigger={selectTrigger}
        onSkip={skipTrigger}
      />

      {/* Top Delivery Notification Banner */}
      <DeliveryBanner deliveredCount={deliveredOrdersCount} />

      {/* Top Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Hero Banner (Only visible when not searching) */}
      {!isSearchingOrFiltering && <HeroBanner />}

      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Kategori
          </h3>
        </div>
        <CategoryPills activeCategory={category} onSelectCategory={setCategory} />
      </div>

      {/* Active Search/Filter Results Grid */}
      {isSearchingOrFiltering ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>
                {category !== 'All' ? category : 'Hasil Pencarian'} ({filteredProducts.length})
              </span>
            </h2>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 my-3 border border-slate-200 shadow-xs">
              <p className="text-sm">Barang tidak ditemukan.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategory('All');
                }}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset pencarian
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
        </section>
      ) : (
        <>
          {/* Lagi Diskon */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Lagi Diskon</span>
              </h2>
              <Link href="/shop" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5">
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {deals.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </section>

          {/* Banyak Dilihat */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Banyak Dilihat</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {popular.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </section>

          {/* Pilihan Buat Kamu */}
          <section className="mb-2">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-bold text-slate-900">Pilihan Buat Kamu</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {forYou.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
