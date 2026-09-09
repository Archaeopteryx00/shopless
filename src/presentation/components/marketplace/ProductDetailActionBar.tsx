'use client';

import React from 'react';
import { useProductDetailContext } from '@/presentation/context/ProductDetailContext';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';

export function ProductDetailActionBar() {
  const {
    isProductDetail,
    addState,
    buyNowState,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetailContext();

  if (!isProductDetail) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] flex items-center gap-2.5">
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
  );
}
