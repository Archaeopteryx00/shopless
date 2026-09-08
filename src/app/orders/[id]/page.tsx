'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/presentation/hooks/useOrders';
import { useReflections } from '@/presentation/hooks/useReflections';
import { ShippingTimeline } from '@/presentation/components/shipping/ShippingTimeline';
import { SpeedToggle } from '@/presentation/components/shipping/SpeedToggle';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Calendar, Sparkles, MessageSquare } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrderWithStatusById, speedMultiplier, changeSpeedMultiplier } = useOrders();
  const { getReflectionByOrderId } = useReflections();

  const item = getOrderWithStatusById(orderId);
  const reflection = getReflectionByOrderId(orderId);

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

  const getReflectionBadgeText = () => {
    if (!reflection) return null;
    if (reflection.stillWanted === 'yes') return 'Still wanted after 24h';
    if (reflection.stillWanted === 'probably') return 'Probably would buy';
    if (reflection.stillWanted === 'dont_care') return "Didn't really care after 24h";
    return 'Questioned purchase after 24h';
  };

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

      {/* Delivered Notification & Reflection Action Banner */}
      {status.isDelivered && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-3 text-emerald-400 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div>
              <h3 className="text-xs font-bold text-emerald-300">Package Delivered 📦</h3>
              <p className="text-[11px] text-emerald-400/90 mt-0.5">
                Simulated shipment completed after 24-hour cooling off period.
              </p>
            </div>
          </div>

          {reflection ? (
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-200 flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Completed Reflection
                </span>
                <Link
                  href={`/orders/${order.id}/reflect`}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Edit
                </Link>
              </div>
              <p className="font-semibold text-white">{getReflectionBadgeText()}</p>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Spend real money today?</span>
                <span className={reflection.wouldBuyReal ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {reflection.wouldBuyReal ? 'Yes' : 'No'}
                </span>
              </div>
              {reflection.reason && (
                <p className="text-[11px] text-slate-400 italic mt-0.5">
                  &quot;{reflection.reason}&quot;
                </p>
              )}
            </div>
          ) : (
            <Link
              href={`/orders/${order.id}/reflect`}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all mt-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reflect on this Purchase</span>
            </Link>
          )}
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
