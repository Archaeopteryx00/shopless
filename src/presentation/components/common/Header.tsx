'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '@/presentation/hooks/useCart';

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
            Shopless
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/cart"
          className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
          aria-label="View Cart"
        >
          <ShoppingCart className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md animate-scaleIn">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
