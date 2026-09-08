'use client';

import React from 'react';
import { ProductCategory } from '@/domain/models/Product';
import { Sparkles, Laptop, BookOpen, Coffee, Shirt, Grid } from 'lucide-react';

interface CategoryPillsProps {
  activeCategory: ProductCategory | 'All';
  onSelectCategory: (category: ProductCategory | 'All') => void;
}

export function CategoryPills({ activeCategory, onSelectCategory }: CategoryPillsProps) {
  const categories: { key: ProductCategory | 'All'; label: string; icon: React.ElementType }[] = [
    { key: 'All', label: 'Semua', icon: Grid },
    { key: 'Tech', label: 'Teknologi', icon: Laptop },
    { key: 'Books & Learning', label: 'Buku & Belajar', icon: BookOpen },
    { key: 'Lifestyle', label: 'Gaya Hidup', icon: Coffee },
    { key: 'Fashion', label: 'Fashion', icon: Shirt },
    { key: 'Hobbies', label: 'Hobi', icon: Sparkles },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-4 px-4 select-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory(cat.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
