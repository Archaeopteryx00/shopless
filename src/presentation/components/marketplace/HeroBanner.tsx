'use client';

import React from 'react';
import { ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-5 text-white shadow-xl shadow-blue-500/10 border border-blue-400/20">
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Impulse-Free Shopping Simulation</span>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white leading-snug">
          Shop anything. <br />
          <span className="text-blue-200">Spend zero real money.</span>
        </h2>

        <p className="text-xs text-blue-100/90 leading-relaxed max-w-xs mt-1">
          Browse items, create carts, simulate orders, and reflect on what you actually want after cooling off.
        </p>

        <div className="mt-3 flex items-center gap-2 text-[10px] bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 w-fit text-blue-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Free & Local-First — No Account Required</span>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
