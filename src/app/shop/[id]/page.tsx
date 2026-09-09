'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useProductDetailContext } from '@/presentation/context/ProductDetailContext';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { Toast } from '@/presentation/components/common/Toast';
import { ProductDetailSkeleton } from '@/presentation/components/common/Skeletons';
import { StoreCard } from '@/presentation/components/marketplace/StoreCard';
import { ProductReviews } from '@/presentation/components/marketplace/ProductReviews';
import { ProductRecommendations } from '@/presentation/components/marketplace/ProductRecommendations';
import { getPublicProductShareUrl } from '@/services/shareUrl';
import { ArrowLeft, Heart, Star, Plus, Minus, Tag, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { getProductById } = useProducts();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const {
    quantity,
    setQuantity,
    whyWanted,
    setWhyWanted,
    addState,
    toastMessage,
    toastType,
    setToastMessage,
    setToastType,
  } = useProductDetailContext();

  const product = getProductById(productId);

  const [isLoading, setIsLoading] = React.useState(true);

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

  const handleToggleWishlist = async () => {
    const isNowSaved = await toggleWishlist(product.id);
    setToastType('wishlist');
    setToastMessage(isNowSaved ? 'Disimpan ke Wishlist' : 'Dihapus dari Wishlist');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareProduct = async () => {
    const url = getPublicProductShareUrl(product.id);
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

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mt-1">
          <span className="text-xs font-bold text-slate-800">Jumlah Pembelian</span>
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

        {/* Optional Shopping Intention Prompt */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800">
              Alasan Tertarik <span className="text-slate-400 font-normal text-[10px]">(opsional untuk analisis belanja)</span>
            </label>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {whyOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhyWanted(whyWanted === option ? '' : option)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                  whyWanted === option
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Toko / Seller Section */}
        <StoreCard category={product.category} />

        {/* Review / Ulasan Pembeli Section */}
        <ProductReviews
          category={product.category}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* Saran Produk / Produk Serupa */}
        <ProductRecommendations currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
}
