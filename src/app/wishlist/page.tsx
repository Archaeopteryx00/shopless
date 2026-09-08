'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { ProductCard, formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { Toast } from '@/presentation/components/common/Toast';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistedProducts, loading, isWishlisted, toggleWishlist } = useWishlist();
  const { cart: cartRepo } = useRepositories();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-xs">
        Memuat wishlist...
      </div>
    );
  }

  const handleQuickAddToCart = async (productId: string) => {
    await cartRepo.addItem({
      productId,
      quantity: 1,
    });
    setToastMessage('Berhasil ditambah ke keranjang!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      <Toast message={toastMessage || ''} isVisible={!!toastMessage} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
          <h1 className="text-lg font-bold text-slate-900">Wishlist</h1>
        </div>
        <span className="text-xs bg-white text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
          {wishlistedProducts.length} barang
        </span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-500 my-6 flex flex-col items-center gap-3 border border-slate-200 shadow-xs">
          <Heart className="w-12 h-12 text-slate-300 stroke-1" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Belum ada yang disimpan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Barang yang kamu simpan saat jelajah akan muncul di sini.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Jelajah Katalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3"
            >
              <div className="w-16 h-16 shrink-0">
                <ProductImage
                  category={product.category}
                  name={product.name}
                  className="w-full h-full"
                  size="sm"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/shop/${product.id}`} className="hover:text-blue-600 transition-colors">
                  <h3 className="text-xs font-semibold text-slate-900 truncate">{product.name}</h3>
                </Link>
                <span className="text-[10px] text-blue-600 font-medium">{product.category}</span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {formatIDR(product.price)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  aria-label="Hapus dari wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAddToCart(product.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
                  aria-label="Tambah ke Keranjang"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
