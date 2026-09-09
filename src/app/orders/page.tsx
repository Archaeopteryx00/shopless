'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/presentation/hooks/useOrders';
import { SpeedMenu } from '@/presentation/components/shipping/SpeedMenu';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { getMarketplaceStatus, MarketplaceStatusKey } from '@/presentation/utils/orderStatus';
import { Package, Truck, CheckCircle2, ChevronRight, ShoppingBag, Box } from 'lucide-react';
import { ListSkeleton } from '@/presentation/components/common/Skeletons';

export default function OrdersPage() {
  const { ordersWithStatus, speedMultiplier, changeSpeedMultiplier, loading } = useOrders();
  const [activeTab, setActiveTab] = useState<MarketplaceStatusKey>('all');

  const tabs: { key: MarketplaceStatusKey; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'dikemas', label: 'Dikemas' },
    { key: 'dikirim', label: 'Dikirim' },
    { key: 'selesai', label: 'Selesai' },
  ];

  const filteredOrders = ordersWithStatus.filter(({ status }) => {
    if (activeTab === 'all') return true;
    const mpStatus = getMarketplaceStatus(status.currentStage.key);
    return mpStatus.key === activeTab;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Pesanan Saya</h1>
          </div>
        </div>
        <ListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-900">Pesanan Saya</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
            {ordersWithStatus.length}
          </span>
        </div>

        {/* Speed menu (three dots) */}
        <SpeedMenu
          currentMultiplier={speedMultiplier}
          onSelectMultiplier={changeSpeedMultiplier}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto no-scrollbar pb-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          let count = 0;
          if (tab.key === 'all') {
            count = ordersWithStatus.length;
          } else {
            count = ordersWithStatus.filter(
              ({ status }) => getMarketplaceStatus(status.currentStage.key).key === tab.key
            ).length;
          }

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 relative ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-slate-500 my-4 flex flex-col items-center gap-3 border border-slate-200 shadow-xs">
          <Package className="w-10 h-10 text-slate-300 stroke-1" />
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              {activeTab === 'all'
                ? 'Belum ada pesanan'
                : `Tidak ada pesanan dengan status "${tabs.find((t) => t.key === activeTab)?.label}"`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
              Pesanan simulasi kamu akan muncul di sini untuk dilacak statusnya.
            </p>
          </div>
          {ordersWithStatus.length === 0 && (
            <Link
              href="/shop"
              className="mt-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Jelajah Katalog</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOrders.map(({ order, status }) => {
            const firstItem = order.items[0];
            const mpStatus = getMarketplaceStatus(status.currentStage.key);

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3 hover:border-slate-300 transition-all group"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Pesanan #{order.id}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  {/* Simplified Marketplace Status Badge */}
                  <div
                    className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${mpStatus.badgeClass}`}
                  >
                    {mpStatus.key === 'selesai' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : mpStatus.key === 'dikirim' ? (
                      <Truck className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <Box className="w-3 h-3 text-blue-600" />
                    )}
                    <span>{mpStatus.label}</span>
                  </div>
                </div>

                {/* Main Content Preview */}
                <div className="flex gap-3 items-center">
                  {firstItem && (
                    <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                      <ProductImage
                        category={firstItem.category as any}
                        name={firstItem.name}
                        image={firstItem.image}
                        className="w-full h-full object-cover"
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      {firstItem ? firstItem.name : 'Pesanan Simulasi'}
                    </h3>
                    {order.items.length > 1 && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        +{order.items.length - 1} barang lainnya
                      </span>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-slate-900">
                        {formatIDR(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">(Rp 0 Real)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    <span className="hidden sm:inline">Lacak</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
