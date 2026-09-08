'use client';

import React from 'react';
import { ProductCategory } from '@/domain/models/Product';
import { Sparkles, Laptop, BookOpen, Coffee, Shirt, Grid } from 'lucide-react';

interface CategoryPillsProps {
  activeCategory: ProductCategory | 'All';
  onSelectCategory: (category: ProductCategory | 'All') => void;
}

export function CategoryPills({ activeCategory, onSelectCategory }: CategoryPillsProps) {
  const categories: { label: ProductCategory | 'All'; icon: React.ElementType }[] = [
    { label: 'All', icon: Grid },
    { label: 'Tech', icon: Laptop },
    { label: 'Books & Learning', icon: BookOpen },
    { label: 'Lifestyle', icon: Coffee },
    { label: 'Fashion', icon: Shirt },
    { label: 'Hobbies', icon: Sparkles },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 select-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.label;
        return (
          <button
            key={cat.label}
            type="button"
            onClick={() => onSelectCategory(cat.label)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
