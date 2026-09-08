'use client';

import React from 'react';
import { FastForward, Zap } from 'lucide-react';

interface SpeedToggleProps {
  currentMultiplier: number;
  onSelectMultiplier: (multiplier: number) => void;
}

export function SpeedToggle({ currentMultiplier, onSelectMultiplier }: SpeedToggleProps) {
  const options = [
    { label: '1x (24h Real)', value: 1 },
    { label: '60x (1m = 1h)', value: 60 },
    { label: '1440x (Instant)', value: 1440 },
  ];

  return (
    <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>Dev Time-Warp Simulation</span>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-semibold">
          {currentMultiplier}x Speed
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelectMultiplier(opt.value)}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center justify-center gap-1 border ${
              currentMultiplier === opt.value
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
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
