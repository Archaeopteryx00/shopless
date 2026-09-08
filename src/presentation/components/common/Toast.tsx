'use client';

import React from 'react';
import { CheckCircle2, Heart } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'wishlist';
  isVisible: boolean;
}

export function Toast({ message, type = 'success', isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-slate-700/80">
        {type === 'wishlist' ? (
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
