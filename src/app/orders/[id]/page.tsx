'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/presentation/hooks/useOrders';
import { ShippingTimeline } from '@/presentation/components/shipping/ShippingTimeline';
import { SpeedToggle } from '@/presentation/components/shipping/SpeedToggle';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Calendar } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrderWithStatusById, speedMultiplier, changeSpeedMultiplier } = useOrders();
  const item = getOrderWithStatusById(orderId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
        <p className="text-slate-400 text-sm">Order not found.</p>
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    );
  }

  const { order, status } = item;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            status.isDelivered
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}
        >
          Order #{order.id}
        </span>
      </div>

      {/* Speed Time-Warp Controls */}
      <SpeedToggle
        currentMultiplier={speedMultiplier}
        onSelectMultiplier={changeSpeedMultiplier}
      />

      {/* Delivered Notification if ready */}
      {status.isDelivered && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-emerald-300">Package Delivered 📦</h3>
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              Simulated shipment completed after 24-hour cooling off period.
            </p>
          </div>
        </div>
      )}

      {/* 8-Stage Interactive Shipping Timeline */}
      <ShippingTimeline status={status} />

      {/* Shipping & Payment Meta Box */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Order Date</span>
          </div>
          <span className="text-slate-200 font-medium">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Address</span>
          </div>
          <span className="text-slate-200 font-medium">{order.shippingAddressName}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payment Method</span>
          </div>
          <span className="text-slate-200 font-medium">{order.paymentMethodName}</span>
        </div>
      </div>

      {/* Snapshot Items List */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Items Ordered ({order.items.length})
        </h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center pt-2 border-t border-slate-800/60 first:pt-0 first:border-0">
              <div className="w-12 h-12 shrink-0">
                <ProductImage
                  category={item.category as any}
                  name={item.name}
                  className="w-full h-full"
                  size="sm"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-100 truncate">{item.name}</h4>
                {item.whyWanted && (
                  <span className="text-[10px] text-slate-400 block truncate">
                    Motivation: {item.whyWanted}
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-bold text-white">
                    {formatIDR(item.price)}
                  </span>
                  <span className="text-[10px] text-slate-500">Qty: {item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total Summary */}
        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Simulated Spending</span>
            <span className="text-white font-bold">{formatIDR(order.totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
            <span className="text-emerald-400">Real Money Spent</span>
            <span className="text-emerald-400 text-sm">Rp 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
