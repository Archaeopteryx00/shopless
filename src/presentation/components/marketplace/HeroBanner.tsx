'use client';

import React from 'react';

export function HeroBanner() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      <img
        src="/hero-banner.png"
        alt="Shopless Hero Banner"
        className="w-full h-auto object-cover rounded-xl block"
        loading="eager"
      />
    </div>
  );
}
