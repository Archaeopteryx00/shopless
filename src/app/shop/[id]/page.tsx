'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useWishlist } from '@/presentation/hooks/useWishlist';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ArrowLeft, Heart, Star, ShoppingCart, Plus, Minus, CheckCircle, Tag } from 'lucide-react';

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
  const [addedToast, setAddedToast] = useState(false);

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
        <p className="text-slate-400 text-sm">Product not found.</p>
        <button
          type="button"
          onClick={() => router.push('/shop')}
          className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
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
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const whyOptions = [
    'I need it',
    'I like it',
    'It looks useful',
    "It's cheap",
    "I don't know",
  ];

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`p-2.5 rounded-xl border transition-all ${
            isWishlisted(product.id)
              ? 'bg-rose-500/20 text-rose-500 border-rose-500/30'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-rose-400'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square relative">
        <ProductImage
          category={product.category}
          name={product.name}
          className="w-full h-full shadow-2xl"
          size="xl"
        />
        {discountPercent && (
          <span className="absolute top-4 left-4 z-30 bg-rose-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold ml-auto">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 font-normal">({product.reviewCount} reviews)</span>
          </div>
        </div>

        <h1 className="text-lg font-bold text-slate-100 leading-snug">{product.name}</h1>

        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-800">
          <span className="text-2xl font-bold text-white tracking-tight">
            {formatIDR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through">
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
                className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800 mt-1">
          {product.description}
        </p>

        {/* Optional Reflection Prompt: Why do you want this? */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 mt-2">
          <label className="text-xs font-semibold text-slate-200 block mb-2">
            Why do you want this? <span className="text-slate-500 font-normal">(Optional reflection)</span>
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {whyOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWhyWanted(whyWanted === option ? '' : option)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                  whyWanted === option
                    ? 'bg-blue-600 text-white border-blue-500 font-medium shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Add to Cart Action */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-100 min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Success Toast */}
        {addedToast && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2.5 rounded-xl text-xs font-medium animate-fadeIn mt-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Added to cart! (Simulated shopping)</span>
          </div>
        )}
      </div>
    </div>
  );
}
