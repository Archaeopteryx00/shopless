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
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-3.5 text-white shadow-xs border border-emerald-500 flex items-center justify-between gap-3 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
          <PackageCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Pesanan Sudah Sampai!
          </h3>
          <p className="text-xs font-semibold text-white mt-0.5">
            {deliveredCount} pesanan sudah diterima. Yuk, lihat lagi!
          </p>
        </div>
      </div>

      <Link
        href="/orders"
        className="px-3.5 py-1.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1"
      >
        <span>Lihat</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
