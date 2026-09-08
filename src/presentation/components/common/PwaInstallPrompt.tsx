'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { ShoplessLogo } from './ShoplessLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true);

    if (isStandalone) {
      return;
    }

    // Check if user previously dismissed prompt
    const dismissedTime = localStorage.getItem('shopless_pwa_dismissed');
    if (dismissedTime) {
      const now = Date.now();
      // Don't show if dismissed within 3 days
      if (now - parseInt(dismissedTime, 10) < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show prompt banner for iOS after 2 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Capture standard beforeinstallprompt event for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('PWA install error:', err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('shopless_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-2 animate-fadeIn pointer-events-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl flex flex-col gap-2 relative">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <ShoplessLogo size={36} className="shadow-xs rounded-lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Pasang Aplikasi Shopless
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              Tambah ke layar utama untuk akses cepat seperti aplikasi asli.
            </p>
          </div>
        </div>

        {showIOSInstructions ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900 flex items-start gap-2 mt-1">
            <Share className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Cara pasang di iPhone/iPad:</p>
              <p className="mt-0.5 text-[10px] text-blue-700">
                1. Ketuk ikon <strong>Bagikan (Share)</strong> di menu Safari.<br />
                2. Pilih <strong>&quot;Tambah ke Layar Utama&quot;</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Nanti Aja
            </button>

            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isIOS ? 'Petunjuk Pasang' : 'Tambah ke Layar Utama'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
