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
    <div className="flex flex-col gap-6">
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
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Categories
          </h3>
        </div>
        <CategoryPills activeCategory={category} onSelectCategory={setCategory} />
      </div>

      {/* Active Search/Filter Results Grid */}
      {isSearchingOrFiltering ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>
                {category !== 'All' ? category : 'Search Results'} ({filteredProducts.length})
              </span>
            </h2>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 my-4">
              <p className="text-sm">No products found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategory('All');
                }}
                className="mt-3 text-xs text-blue-400 font-semibold hover:underline"
              >
                Clear filters
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
          {/* Deals Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Simulated Deals</span>
              </h2>
              <Link href="/shop" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5">
                See all <ArrowRight className="w-3 h-3" />
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

          {/* Popular Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Most Browsed</span>
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

          {/* For You Grid */}
          <section className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-100">For You</h2>
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
