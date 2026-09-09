'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { Toast } from '@/presentation/components/common/Toast';
import { ProductDetailSkeleton } from '@/presentation/components/common/Skeletons';
import { ArrowLeft, Heart, Star, ShoppingCart, Plus, Minus, Tag, Check, ArrowRight, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { getProductById } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { cart: cartRepo } = useRepositories();

  const product = getProductById(productId);

  const [isLoading, setIsLoading] = React.useState(true);
  const [quantity, setQuantity] = useState(1);
  const [whyWanted, setWhyWanted] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'wishlist'>('success');
  const [addState, setAddState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [buyNowState, setBuyNowState] = useState<'idle' | 'processing'>('idle');

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [productId]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push('/shop');
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

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
    if (addState !== 'idle') return;
    setAddState('adding');
    await cartRepo.addItem({
      productId: product.id,
      quantity,
      whyWanted: whyWanted || undefined,
    });
    setAddState('added');
    setToastType('success');
    setToastMessage('Berhasil ditambah ke keranjang!');
    setTimeout(() => setToastMessage(null), 2500);
    setTimeout(() => setAddState('idle'), 1500);
  };

  const handleBuyNow = async () => {
    if (buyNowState !== 'idle') return;
    setBuyNowState('processing');
    await cartRepo.addItem({
      productId: product.id,
      quantity,
      whyWanted: whyWanted || undefined,
    });
    router.push('/cart?checkout=true');
  };

  const handleToggleWishlist = async () => {
    const isNowSaved = await toggleWishlist(product.id);
    setToastType('wishlist');
    setToastMessage(isNowSaved ? 'Disimpan ke Wishlist' : 'Dihapus dari Wishlist');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareProduct = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.name,
          url,
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setToastType('success');
        setToastMessage('Link produk disalin');
        setTimeout(() => setToastMessage(null), 2500);
      } catch (err) {
        console.error('Failed to copy product link:', err);
      }
    }
  };

  const whyOptions = [
    'Aku memang butuh',
    'Aku suka barangnya',
    'Kelihatannya berguna',
    'Lagi pengen aja',
    'Nggak tahu juga',
  ];

  return (
    <div className="flex flex-col gap-5 pb-28 animate-fadeIn">
      <Toast message={toastMessage || ''} type={toastType} isVisible={!!toastMessage} />

      {/* Top Header Navigation: [← Kembali] ... [Share] [Wishlist] */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareProduct}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center justify-center"
            aria-label="Bagikan produk"
            title="Bagikan produk"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Wishlist Button */}
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
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square relative overflow-hidden rounded-xl">
        <ProductImage
          category={product.category}
          name={product.name}
          image={product.image}
          priority={true}
          className={`w-full h-full shadow-sm transition-transform duration-300 ${
            addState === 'adding' ? 'animate-imagePulse scale-105' : ''
          }`}
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

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mt-1">
          <span className="text-xs font-bold text-slate-800">Jumlah</span>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
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
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center gap-2.5">
        {/* Secondary: + Keranjang */}
        <button
          type="button"
          disabled={addState !== 'idle'}
          onClick={handleAddToCart}
          className={`flex-1 font-semibold py-3 px-3 rounded-lg border transition-all flex items-center justify-center gap-1.5 text-xs ${
            addState === 'added'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : addState === 'adding'
              ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-wait'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {addState === 'added' ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>✓ Ditambahkan</span>
            </>
          ) : addState === 'adding' ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
              <span>Menambahkan...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 text-slate-600" />
              <span>+ Keranjang</span>
            </>
          )}
        </button>

        {/* Primary: Beli Sekarang */}
        <button
          type="button"
          disabled={buyNowState !== 'idle'}
          onClick={handleBuyNow}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 disabled:cursor-wait text-white font-bold py-3 px-3 rounded-lg shadow-md flex items-center justify-center gap-1.5 text-xs tracking-wide transition-all"
        >
          {buyNowState === 'processing' ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
