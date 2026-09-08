'use client';

import React from 'react';
import { Laptop, BookOpen, Coffee, Shirt, Sparkles, Package } from 'lucide-react';
import { ProductCategory } from '@/domain/models/Product';

interface ProductImageProps {
  category: ProductCategory;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ProductImage({ category, name, className = '', size = 'md' }: ProductImageProps) {
  const getCategoryGradient = (cat: ProductCategory) => {
    switch (cat) {
      case 'Tech':
        return 'from-blue-50 to-slate-100 text-blue-600 border-slate-200';
      case 'Books & Learning':
        return 'from-emerald-50 to-slate-100 text-emerald-600 border-slate-200';
      case 'Lifestyle':
        return 'from-indigo-50 to-slate-100 text-indigo-600 border-slate-200';
      case 'Fashion':
        return 'from-pink-50 to-slate-100 text-pink-600 border-slate-200';
      case 'Hobbies':
        return 'from-sky-50 to-slate-100 text-sky-600 border-slate-200';
      default:
        return 'from-slate-50 to-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = (cat: ProductCategory) => {
    const iconClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : size === 'xl' ? 'w-16 h-16' : 'w-9 h-9';
    switch (cat) {
      case 'Tech':
        return <Laptop className={iconClass} />;
      case 'Books & Learning':
        return <BookOpen className={iconClass} />;
      case 'Lifestyle':
        return <Coffee className={iconClass} />;
      case 'Fashion':
        return <Shirt className={iconClass} />;
      case 'Hobbies':
        return <Sparkles className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-b border overflow-hidden rounded-xl select-none ${getCategoryGradient(
        category
      )} ${className}`}
    >
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
        {getCategoryIcon(category)}
      </div>

      {(size === 'lg' || size === 'xl') && (
        <span className="relative z-10 mt-2 text-xs font-semibold text-slate-700 text-center px-3 line-clamp-1">
          {name}
        </span>
      )}
    </div>
  );
}
