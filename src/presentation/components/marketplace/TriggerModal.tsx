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
    'I just got some money',
    'I feel like buying something',
    "I'm bored",
    'I saw something I want',
    'I actually need something',
    "I don't know",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm glass-panel rounded-2xl p-5 border border-slate-700 shadow-2xl flex flex-col gap-4 relative">
        <button
          type="button"
          onClick={onSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Shopping Motivation</span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">What brought you here?</h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding your motivation helps track shopping patterns later.
          </p>
        </div>

        <div className="flex flex-col gap-2 my-1">
          {triggerOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelectTrigger(option)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-600 hover:text-white text-xs font-medium text-slate-200 border border-slate-700/70 hover:border-blue-500 transition-all duration-200"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">Optional selection</span>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
