'use client';

import React from 'react';
import Link from 'next/link';
import { useInsights } from '@/presentation/hooks/useInsights';
import { useReflections } from '@/presentation/hooks/useReflections';
import { useOrders } from '@/presentation/hooks/useOrders';
import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';
import { MetricsCard } from '@/presentation/components/insights/MetricsCard';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { BarChart2, ShoppingBag, ShieldCheck, Sparkles, Clock, PieChart } from 'lucide-react';

export default function InsightsPage() {
  const { insights, loading } = useInsights();
  const { reflections } = useReflections();
  const { orders } = useOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-xs">
        Memuat ringkasan...
      </div>
    );
  }

  const {
    totalSessions,
    totalPurchases,
    totalSimulatedSpending,
    totalRealMoneySpent,
    totalReflections,
    stillWantedCount,
    persistenceRate,
    wouldNotBuyRealCount,
    wouldNotBuyRealPercent,
    hasReflections,
    insightSummaryMessage,
  } = insights;

  // Compute category persistence breakdown if reflections exist
  const categoryBreakdown = (() => {
    if (reflections.length === 0 || orders.length === 0) return [];
    const catMap = new Map<string, { total: number; wanted: number }>();

    reflections.forEach((ref) => {
      const order = orders.find((o) => o.id === ref.orderId);
      if (!order) return;
      order.items.forEach((item: any) => {
        const cat = item.category || 'Lainnya';
        const current = catMap.get(cat) || { total: 0, wanted: 0 };
        current.total += 1;
        if (ref.stillWanted === 'yes' || ref.stillWanted === 'probably') {
          current.wanted += 1;
        }
        catMap.set(cat, current);
      });
    });

    return Array.from(catMap.entries()).map(([cat, val]) => ({
      category: cat,
      total: val.total,
      wanted: val.wanted,
      rate: Math.round((val.wanted / val.total) * 100),
    }));
  })();

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-900">Ringkasan Belanja</h1>
        </div>
        <span className="text-xs bg-white text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium shadow-xs">
          Lokal
        </span>
      </div>

      {/* Top Behavioral Insight Message Box */}
      {hasReflections ? (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-xs flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Setelah 24 Jam</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {insightSummaryMessage}
          </p>
          <p className="text-xs text-blue-100/90 mt-0.5">
            {wouldNotBuyRealPercent > 0
              ? `${wouldNotBuyRealPercent}% dari barang yang kamu refleksikan tidak akan kamu beli jika menggunakan uang sungguhan.`
              : 'Semua barang yang kamu refleksikan dinilai tetap ingin dibeli.'}
          </p>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-8 text-center text-slate-500 my-2 flex flex-col items-center gap-3 border border-slate-200 shadow-xs">
          <PieChart className="w-10 h-10 text-slate-300 stroke-1" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Belum ada yang bisa dilihat</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Setelah menyelesaikan simulasi belanja dan refleksi 24 jam, kamu bisa melihat polanya di sini.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Mulai Belanja</span>
          </Link>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 min-w-0">
        <MetricsCard
          label="Total Sesi"
          value={totalSessions}
          subtext="Buka aplikasi"
          icon={Clock}
          variant="slate"
        />

        <MetricsCard
          label="Pesanan Simulasi"
          value={totalPurchases}
          subtext="Checkout dibuat"
          icon={ShoppingBag}
          variant="blue"
        />

        <MetricsCard
          label="Total Belanja Simulasi"
          value={formatIDR(totalSimulatedSpending)}
          subtext="Total harga keranjang"
          icon={PieChart}
          variant="blue"
        />

        <MetricsCard
          label="Uang Keluar"
          value={formatIDR(totalRealMoneySpent)}
          subtext="100% Gratis"
          icon={ShieldCheck}
          variant="emerald"
        />
      </div>

      {/* 24h Persistence Rate Indicator (Only if reflections exist) */}
      {hasReflections && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Tingkat Keinginan 24 Jam
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{persistenceRate}%</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-blue-600">
                {stillWantedCount} / {totalReflections}
              </span>
              <p className="text-[10px] text-slate-400">Refleksi Selesai</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${persistenceRate}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
            Dihitung dari pesanan yang sudah direfleksikan ({totalReflections} total). Pesanan yang masih dalam pengiriman tidak dihitung.
          </p>
        </div>
      )}

      {/* Category Breakdown (If available) */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Analisis per Kategori
          </h3>
          <div className="flex flex-col gap-2">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-semibold">{item.category}</span>
                <span className="font-bold text-blue-600">
                  {item.wanted}/{item.total} ({item.rate}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Money Evaluation Breakdown */}
      {hasReflections && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Evaluasi Uang Sungguhan
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-700">TIDAK akan dibeli dengan uang sungguhan</span>
              <span className="font-bold text-rose-600">
                {wouldNotBuyRealCount} ({wouldNotBuyRealPercent}%)
              </span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-700">TETAP akan dibeli dengan uang sungguhan</span>
              <span className="font-bold text-emerald-600">
                {totalReflections - wouldNotBuyRealCount} ({100 - wouldNotBuyRealPercent}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
