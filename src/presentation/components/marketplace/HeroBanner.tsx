'use client';

import React from 'react';
import { ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-sm border border-blue-500">
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>Simulasi Belanja • Gratis</span>
        </div>

        <h2 className="text-lg font-bold tracking-tight text-white leading-snug">
          Mau cari apa hari ini?
        </h2>

        <p className="text-xs text-blue-100/95 leading-relaxed max-w-xs">
          Temukan barang yang kamu suka, masukin ke keranjang, dan checkout seperti biasa.
        </p>
      </div>
    </div>
  );
}
