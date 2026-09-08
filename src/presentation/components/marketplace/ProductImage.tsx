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
  // Return sleek category-tailored visual placeholders with gradient backgrounds and iconography
  const getCategoryGradient = (cat: ProductCategory) => {
    switch (cat) {
      case 'Tech':
        return 'from-blue-600/30 via-indigo-600/20 to-slate-900 border-blue-500/20 text-blue-400';
      case 'Books & Learning':
        return 'from-emerald-600/30 via-teal-600/20 to-slate-900 border-emerald-500/20 text-emerald-400';
      case 'Lifestyle':
        return 'from-amber-600/30 via-orange-600/20 to-slate-900 border-amber-500/20 text-amber-400';
      case 'Fashion':
        return 'from-purple-600/30 via-pink-600/20 to-slate-900 border-pink-500/20 text-pink-400';
      case 'Hobbies':
        return 'from-cyan-600/30 via-sky-600/20 to-slate-900 border-cyan-500/20 text-cyan-400';
      default:
        return 'from-slate-700/30 to-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getCategoryIcon = (cat: ProductCategory) => {
    const iconClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : size === 'xl' ? 'w-24 h-24' : 'w-10 h-10';
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
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br border overflow-hidden rounded-xl select-none ${getCategoryGradient(
        category
      )} ${className}`}
    >
      {/* Background ambient lighting blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />

      {/* Decorative category badge */}
      <div className="relative z-20 transition-transform duration-300 group-hover:scale-110">
        {getCategoryIcon(category)}
      </div>

      {/* Product Name overlay footer for larger previews */}
      {(size === 'lg' || size === 'xl') && (
        <span className="relative z-20 mt-3 text-xs font-medium text-slate-300 text-center px-4 line-clamp-1 opacity-80">
          {name}
        </span>
      )}
    </div>
  );
}
