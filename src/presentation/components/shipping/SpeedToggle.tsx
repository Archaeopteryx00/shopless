'use client';

import React from 'react';
import { FastForward, Zap } from 'lucide-react';

interface SpeedToggleProps {
  currentMultiplier: number;
  onSelectMultiplier: (multiplier: number) => void;
}

export function SpeedToggle({ currentMultiplier, onSelectMultiplier }: SpeedToggleProps) {
  const options = [
    { label: '1x — 24 jam', value: 1 },
    { label: '60x — 1 mnt = 1h', value: 60 },
    { label: '1440x — Instan', value: 1440 },
  ];

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Simulasi Waktu</span>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-mono font-semibold">
          {currentMultiplier}x Kecepatan
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelectMultiplier(opt.value)}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all duration-150 flex items-center justify-center gap-1 border ${
              currentMultiplier === opt.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {opt.value > 1 && <FastForward className="w-3 h-3" />}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
