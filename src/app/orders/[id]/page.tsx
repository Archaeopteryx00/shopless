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
        <p className="text-slate-500 text-sm">Pesanan tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Pesanan
        </button>
      </div>
    );
  }

  const { order, status } = item;

  const getReflectionBadgeText = () => {
    if (!reflection) return null;
    if (reflection.stillWanted === 'yes') return 'Masih pengen setelah 24 jam';
    if (reflection.stillWanted === 'probably') return 'Kayaknya masih mau beli';
    if (reflection.stillWanted === 'dont_care') return 'Sudah nggak terlalu tertarik';
    return 'Sempat mempertanyakan pesanan';
  };

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/orders')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            status.isDelivered
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          Pesanan #{order.id}
        </span>
      </div>

      {/* Speed Time-Warp Controls */}
      <SpeedToggle
        currentMultiplier={speedMultiplier}
        onSelectMultiplier={changeSpeedMultiplier}
      />

      {/* Delivered Notification & Reflection Action Banner */}
      {status.isDelivered && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col gap-3 text-emerald-900 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <h3 className="text-xs font-bold text-emerald-900">Pesanan Sudah Sampai! 📦</h3>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Paket kamu sudah diterima setelah waktu jeda 24 jam.
              </p>
            </div>
          </div>

          {reflection ? (
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Refleksi Kamu
                </span>
                <Link
                  href={`/orders/${order.id}/reflect`}
                  className="text-[10px] text-blue-600 hover:underline font-semibold"
                >
                  Ubah
                </Link>
              </div>
              <p className="font-bold text-slate-900">{getReflectionBadgeText()}</p>
              <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <span>Mau beli pakai uang sungguhan?</span>
                <span className={reflection.wouldBuyReal ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {reflection.wouldBuyReal ? 'Ya' : 'Nggak'}
                </span>
              </div>
              {reflection.reason && (
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  &quot;{reflection.reason}&quot;
                </p>
              )}
            </div>
          ) : (
            <Link
              href={`/orders/${order.id}/reflect`}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all mt-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Refleksikan Pesanan Ini</span>
            </Link>
          )}
        </div>
      )}

      {/* 8-Stage Interactive Shipping Timeline */}
      <ShippingTimeline status={status} />

      {/* Shipping & Payment Meta Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanggal Pesanan</span>
          </div>
          <span className="text-slate-900 font-medium">
            {new Date(order.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Alamat Pengiriman</span>
          </div>
          <span className="text-slate-900 font-medium">{order.shippingAddressName}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Metode Pembayaran</span>
          </div>
          <span className="text-slate-900 font-medium">{order.paymentMethodName}</span>
        </div>
      </div>

      {/* Snapshot Items List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Barang Dipesan ({order.items.length})
        </h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center pt-2 border-t border-slate-100 first:pt-0 first:border-0">
              <div className="w-12 h-12 shrink-0">
                <ProductImage
                  category={item.category as any}
                  name={item.name}
                  className="w-full h-full"
                  size="sm"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h4>
                {item.whyWanted && (
                  <span className="text-[10px] text-slate-500 block truncate">
                    Alasan: {item.whyWanted}
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-bold text-slate-900">
                    {formatIDR(item.price)}
                  </span>
                  <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total Summary */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Total Belanja Simulasi</span>
            <span className="text-slate-900 font-bold">{formatIDR(order.totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
            <span className="text-emerald-700">Total Bayar Sungguhan</span>
            <span className="text-emerald-700 text-sm">Rp 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
