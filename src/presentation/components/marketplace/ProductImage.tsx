'use client';

import React, { useState } from 'react';
import { Laptop, BookOpen, Coffee, Shirt, Sparkles, Package } from 'lucide-react';
import { ProductCategory } from '@/domain/models/Product';

interface ProductImageProps {
  category: ProductCategory;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  image?: string;
  priority?: boolean;
}

export function ProductImage({
  category,
  name,
  className = '',
  size = 'md',
  image,
  priority = false,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    const iconClass =
      size === 'sm'
        ? 'w-6 h-6'
        : size === 'lg'
        ? 'w-12 h-12'
        : size === 'xl'
        ? 'w-16 h-16'
        : 'w-9 h-9';
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

  if (image && !imageError) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center ${className}`}
      >
        {/* Skeleton shimmer placeholder while image loads */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse motion-reduce:animate-none z-10" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

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
