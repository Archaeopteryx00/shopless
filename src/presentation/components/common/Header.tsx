'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles } from 'lucide-react';

export function Header() {
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

      <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Simulated Shopping
      </div>
    </header>
  );
}
