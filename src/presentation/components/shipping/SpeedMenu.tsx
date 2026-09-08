'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Check, Zap } from 'lucide-react';

interface SpeedMenuProps {
  currentMultiplier: number;
  onSelectMultiplier: (multiplier: number) => void;
}

export function SpeedMenu({ currentMultiplier, onSelectMultiplier }: SpeedMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: '1× — 24 jam', sub: 'Kecepatan normal', value: 1 },
    { label: '60× — 1 mnt = 1 jam', sub: 'Cepat (60 kali)', value: 60 },
    { label: '1440× — Instan', sub: 'Sangat cepat', value: 1440 },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent focus:outline-none"
        aria-label="Menu Opsi"
        title="Opsi Simulasi"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-50 p-2 animate-fadeIn">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Kecepatan simulasi</span>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
              {currentMultiplier}x
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            {options.map((opt) => {
              const isSelected = currentMultiplier === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelectMultiplier(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{opt.sub}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
