'use client';

import React from 'react';
import Image from 'next/image';

export function HeroBanner() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      <Image
        src="/HeroBanner.png"
        alt="Shopless Hero Banner"
        width={1200}
        height={600}
        priority
        className="w-full h-auto object-cover rounded-xl block"
      />
    </div>
  );
}
