'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { Toast } from '@/presentation/components/common/Toast';
import { ArrowLeft, Heart, Star, ShoppingCart, Plus, Minus, Tag } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { getProductById } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { cart: cartRepo } = useRepositories();

  const product = getProductById(productId);

  const [quantity, setQuantity] = useState(1);
  const [whyWanted, setWhyWanted] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'wishlist'>('success');

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push('/shop');
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
        <p className="text-slate-500 text-sm">Barang tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => router.push('/shop')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog
        </button>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    await cartRepo.addItem({
      productId: product.id,
      quantity,
      whyWanted: whyWanted || undefined,
    });
    setToastType('success');
    setToastMessage('Berhasil ditambah ke keranjang!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleWishlist = async () => {
    const isNowSaved = await toggleWishlist(product.id);
    setToastType('wishlist');
    setToastMessage(isNowSaved ? 'Disimpan ke Wishlist' : 'Dihapus dari Wishlist');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const whyOptions = [
    'Aku memang butuh',
    'Aku suka barangnya',
    'Kelihatannya berguna',
    'Lagi pengen aja',
    'Nggak tahu juga',
  ];

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      <Toast message={toastMessage || ''} type={toastType} isVisible={!!toastMessage} />

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isWishlisted(product.id)
              ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-current text-rose-600' : ''}`} />
          <span>{isWishlisted(product.id) ? 'Tersimpan' : 'Simpan'}</span>
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square relative">
        <ProductImage
          category={product.category}
          name={product.name}
          className="w-full h-full shadow-sm"
          size="xl"
        />
        {discountPercent && (
          <span className="absolute top-4 left-4 z-20 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
            Diskon {discountPercent}%
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-700 font-semibold ml-auto">
            <Star className="w-3.5 h-3.5 fill-slate-700 text-slate-700" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
          </div>
        </div>

        <h1 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h1>

        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatIDR(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mt-1">
          {product.description}
        </p>

        {/* Motivation Prompt: Kenapa tertarik sama barang ini? */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mt-1">
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Kenapa tertarik sama barang ini? <span className="text-slate-400 font-normal">(opsional)</span>
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {whyOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhyWanted(whyWanted === option ? '' : option)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                  whyWanted === option
                    ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart Action */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-xs transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
