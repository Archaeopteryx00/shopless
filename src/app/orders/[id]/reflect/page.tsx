'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/presentation/hooks/useOrders';
import { useReflections } from '@/presentation/hooks/useReflections';
import { StillWantedOption } from '@/domain/models/Reflection';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { ArrowLeft, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export default function OrderReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrderWithStatusById } = useOrders();
  const { getReflectionByOrderId, saveReflection } = useReflections();

  const item = getOrderWithStatusById(orderId);
  const existingReflection = getReflectionByOrderId(orderId);

  const [stillWanted, setStillWanted] = useState<StillWantedOption>('yes');
  const [wouldBuyReal, setWouldBuyReal] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Rule: Do not show reflection before delivery
  if (!status.isDelivered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs my-6">
        <Sparkles className="w-10 h-10 text-blue-600" />
        <h2 className="text-sm font-bold text-slate-900">Pesanan Masih Dalam Perjalanan</h2>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Refleksi pesanan baru bisa dibuka setelah paket tiba di tujuan.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-xs"
        >
          Lacak Pengiriman
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await saveReflection({
        orderId: order.id,
        stillWanted,
        wouldBuyReal,
        reason: reason.trim() || undefined,
      });
      router.push(`/orders/${order.id}`);
    } catch (err) {
      console.error('Failed to submit reflection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stillWantedOptions: { value: StillWantedOption; label: string }[] = [
    { value: 'yes', label: 'Ya, masih pengen' },
    { value: 'probably', label: 'Kayaknya masih mau beli' },
    { value: 'dont_care', label: 'Sudah nggak terlalu tertarik' },
    { value: 'why_did_i', label: 'Kenapa tadi pengen beli ini?' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
          Refleksi Pesanan
        </span>
      </div>

      {/* Order Info Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Pesanan #{order.id}
          </span>
          <h3 className="text-xs font-bold text-slate-900 mt-0.5">
            {order.items.length} barang ({formatIDR(order.totalAmount)})
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 font-bold">
          Diterima
        </span>
      </div>

      {/* Already Reflected Banner */}
      {existingReflection && (
        <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Kamu sudah pernah mengisi refleksi pesanan ini. Kamu bisa memperbaruinya di bawah.</span>
        </div>
      )}

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Question 1: Masih pengen barang ini? */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>1. Setelah punya waktu buat mikir... Masih pengen barang ini?</span>
          </label>
          <div className="flex flex-col gap-2">
            {stillWantedOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStillWanted(opt.value)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition-all ${
                  stillWanted === opt.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Kalau harus bayar pakai uang sungguhan... */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>2. Kalau harus bayar pakai uang sungguhan hari ini, kamu masih mau beli?</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWouldBuyReal(true)}
              className={`py-3 px-4 rounded-lg text-xs font-semibold border transition-all text-center ${
                wouldBuyReal
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Ya
            </button>
            <button
              type="button"
              onClick={() => setWouldBuyReal(false)}
              className={`py-3 px-4 rounded-lg text-xs font-semibold border transition-all text-center ${
                !wouldBuyReal
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Nggak
            </button>
          </div>
        </div>

        {/* Question 3: Optional reason text box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-800">
            Apa yang berubah? <span className="text-slate-400 font-normal">(opsional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ceritain sedikit kalau mau..."
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all"
          />
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-lg shadow-md text-xs tracking-wide transition-all mt-1"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Refleksi'}
        </button>
      </form>
    </div>
  );
}
