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
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'amber':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'blue':
        return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      default:
        return 'text-slate-300 border-slate-700/60 bg-slate-800/40';
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${getVariantStyles()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{value}</h3>
        {subtext && <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}
