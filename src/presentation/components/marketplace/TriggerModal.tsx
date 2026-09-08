'use client';

import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface TriggerModalProps {
  isOpen: boolean;
  onSelectTrigger: (trigger: string) => void;
  onSkip: () => void;
}

export function TriggerModal({ isOpen, onSelectTrigger, onSkip }: TriggerModalProps) {
  if (!isOpen) return null;

  const triggerOptions = [
    'Aku baru dapat uang',
    'Lagi pengen belanja',
    'Lagi bosan',
    'Baru lihat barang yang aku mau',
    'Memang lagi butuh sesuatu',
    'Nggak tahu',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200 shadow-xl flex flex-col gap-4 relative">
        <button
          type="button"
          onClick={onSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Dorongan Belanja</span>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">Apa yang bikin kamu mampir?</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Pilih alasan kamu membuka aplikasi saat ini (opsional).
          </p>
        </div>

        <div className="flex flex-col gap-2 my-1">
          {triggerOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelectTrigger(option)}
              className="w-full text-left px-3.5 py-2.5 rounded-lg bg-slate-50 hover:bg-blue-600 hover:text-white text-xs font-medium text-slate-800 border border-slate-200 hover:border-blue-600 transition-all duration-150"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[10px] text-slate-400">Pilihan opsional</span>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
          >
            Nanti aja
          </button>
        </div>
      </div>
    </div>
  );
}
