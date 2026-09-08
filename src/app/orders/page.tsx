'use client';

import React from 'react';
import Link from 'next/link';
import { useOrders } from '@/presentation/hooks/useOrders';
import { SpeedToggle } from '@/presentation/components/shipping/SpeedToggle';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { Package, Truck, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const { ordersWithStatus, speedMultiplier, changeSpeedMultiplier, loading } = useOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-xs">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-bold text-slate-100">Simulated Orders</h1>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
          {ordersWithStatus.length} orders
        </span>
      </div>

      {/* Speed Time-Warp Controls */}
      <SpeedToggle
        currentMultiplier={speedMultiplier}
        onSelectMultiplier={changeSpeedMultiplier}
      />

      {ordersWithStatus.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-400 my-4 flex flex-col items-center gap-3">
          <Package className="w-12 h-12 text-slate-600 stroke-1" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">No simulated orders yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Add items to your cart and complete a simulated checkout to track orders here.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {ordersWithStatus.map(({ order, status }) => {
            const firstItem = order.items[0];
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 hover:border-slate-700 transition-all group"
              >
                {/* Order Header info */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Order #{order.id}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      status.isDelivered
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {status.isDelivered ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                    <span>{status.currentStage.label}</span>
                  </div>
                </div>

                {/* Main Content Preview */}
                <div className="flex gap-3 items-center">
                  {firstItem && (
                    <div className="w-14 h-14 shrink-0">
                      <ProductImage
                        category={firstItem.category as any}
                        name={firstItem.name}
                        className="w-full h-full"
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-100 truncate">
                      {firstItem ? firstItem.name : 'Simulated Order'}
                    </h3>
                    {order.items.length > 1 && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-white">
                        {formatIDR(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">(Rp 0 Real)</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
                </div>

                {/* Progress bar preview */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{status.estimatedTimeRemainingText}</span>
                  <span className="font-semibold text-slate-300">{status.progressPercent}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
