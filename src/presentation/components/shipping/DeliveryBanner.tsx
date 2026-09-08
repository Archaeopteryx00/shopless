'use client';

import React from 'react';
import Link from 'next/link';
import { PackageCheck, ArrowRight } from 'lucide-react';

interface DeliveryBannerProps {
  deliveredCount: number;
}

export function DeliveryBanner({ deliveredCount }: DeliveryBannerProps) {
  if (deliveredCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white shadow-xl shadow-emerald-500/10 border border-emerald-400/30 flex items-center justify-between gap-3 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
          <PackageCheck className="w-6 h-6 text-emerald-200" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Package Delivered 📦
          </h3>
          <p className="text-xs font-semibold text-white mt-0.5">
            {deliveredCount} order{deliveredCount > 1 ? 's' : ''} arrived & ready for reflection!
          </p>
        </div>
      </div>

      <Link
        href="/orders"
        className="px-3.5 py-2 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1"
      >
        <span>View</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
