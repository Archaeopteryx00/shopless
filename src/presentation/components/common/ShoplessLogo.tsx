'use client';

import React from 'react';
import Image from 'next/image';

interface ShoplessLogoProps {
  className?: string;
  size?: number;
}

export function ShoplessLogo({ className = '', size = 28 }: ShoplessLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Shopless Logo"
      width={size}
      height={size}
      className={`rounded-lg object-contain shrink-0 ${className}`}
      priority
    />
  );
}
