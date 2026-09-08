'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'slate';
}

export function MetricsCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'blue',
}: MetricsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'text-emerald-700 border-emerald-200 bg-emerald-50';
      case 'amber':
        return 'text-amber-700 border-amber-200 bg-amber-50';
      case 'blue':
        return 'text-blue-700 border-blue-200 bg-blue-50';
      default:
        return 'text-slate-700 border-slate-200 bg-slate-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${getVariantStyles()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{value}</h3>
        {subtext && <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
