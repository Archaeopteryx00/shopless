'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/presentation/hooks/useCart';
import { ShoplessLogo } from './ShoplessLogo';

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <ShoplessLogo size={32} />
        <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center">
          Shopless
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          Simulasi Belanja
        </span>

        <Link
          href="/cart"
          className="relative p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-colors"
          aria-label="Keranjang Belanja"
        >
          <ShoppingCart className="w-5 h-5 text-slate-700" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
