'use client';

import React from 'react';

interface ShoplessLogoProps {
  className?: string;
  size?: number;
}

export function ShoplessLogo({ className = '', size = 28 }: ShoplessLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Shopping bag base container */}
      <rect x="4" y="9" width="24" height="20" rx="5" fill="#2563EB" />
      {/* Bag Handle */}
      <path
        d="M10 10V7C10 4.79086 11.7909 3 14 3H18C20.2091 3 22 4.79086 22 7V10"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Negative Space "S" curve inside bag */}
      <path
        d="M19 14.5C19 13.6716 17.6569 13 16 13C14.3431 13 13 13.6716 13 14.5C13 16 19 16.5 19 18.5C19 19.8284 17.6569 21 16 21C14.3431 21 13 19.8284 13 18.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
