'use client';

import React from 'react';
import Link from 'next/link';
import { useInsights } from '@/presentation/hooks/useInsights';
import { MetricsCard } from '@/presentation/components/insights/MetricsCard';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { BarChart3, ShoppingBag, Heart, ShieldCheck, Sparkles, Clock, PieChart } from 'lucide-react';

export default function InsightsPage() {
  const { insights, loading } = useInsights();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-xs">
        Calculating insights...
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

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-bold text-slate-100">Behavioral Insights</h1>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
          Local Analytics
        </span>
      </div>

      {/* Top Behavioral Insight Message Box */}
      {hasReflections ? (
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Decision Persistence</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {insightSummaryMessage}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {wouldNotBuyRealPercent > 0
              ? `${wouldNotBuyRealPercent}% of your reflected purchases felt unnecessary when evaluating real money spending.`
              : 'You evaluated all reflected items as items you would spend real money on.'}
          </p>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 my-2 flex flex-col items-center gap-3 border border-slate-800">
          <PieChart className="w-10 h-10 text-slate-600 stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Nothing to analyze yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Your first simulated order and post-purchase reflection will give you behavioral insights to explore.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Start Browsing</span>
          </Link>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricsCard
          label="Shopping Sessions"
          value={totalSessions}
          subtext="Times app was opened"
          icon={Clock}
          variant="slate"
        />

        <MetricsCard
          label="Simulated Purchases"
          value={totalPurchases}
          subtext="Checkout orders created"
          icon={ShoppingBag}
          variant="blue"
        />

        <MetricsCard
          label="Simulated Spending"
          value={formatIDR(totalSimulatedSpending)}
          subtext="Virtual cart total"
          icon={PieChart}
          variant="amber"
        />

        <MetricsCard
          label="Real Money Spent"
          value={formatIDR(totalRealMoneySpent)}
          subtext="100% Free simulation"
          icon={ShieldCheck}
          variant="emerald"
        />
      </div>

      {/* 24h Persistence Rate Indicator (Only if reflections exist) */}
      {hasReflections && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                24h Purchase Persistence Rate
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{persistenceRate}%</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-blue-400">
                {stillWantedCount} / {totalReflections}
              </span>
              <p className="text-[10px] text-slate-500">Reflections</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${persistenceRate}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
            Calculated only from completed reflections ({totalReflections} total). Active or undelivered orders are excluded.
          </p>
        </div>
      )}

      {/* Real Money Evaluation Breakdown */}
      {hasReflections && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Real Money Evaluation
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-300">Would NOT buy with real money</span>
              <span className="font-bold text-rose-400">
                {wouldNotBuyRealCount} ({wouldNotBuyRealPercent}%)
              </span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-300">Would buy with real money</span>
              <span className="font-bold text-emerald-400">
                {totalReflections - wouldNotBuyRealCount} ({100 - wouldNotBuyRealPercent}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
