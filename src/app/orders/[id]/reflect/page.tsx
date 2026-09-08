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

  // Rule: Do not show reflection before delivery
  if (!status.isDelivered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3 glass-panel p-6 rounded-2xl my-6">
        <Sparkles className="w-10 h-10 text-amber-400" />
        <h2 className="text-sm font-bold text-slate-100">Package In Transit</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Reflection becomes available after your package is delivered (24h cooling-off period).
        </p>
        <button
          type="button"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="mt-2 text-xs bg-slate-800 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 font-semibold"
        >
          View Shipping Progress
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
    { value: 'yes', label: 'Yes, I still want it' },
    { value: 'probably', label: "I'd probably buy it" },
    { value: 'dont_care', label: "I don't really care anymore" },
    { value: 'why_did_i', label: 'Why did I buy this?' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order
        </button>
        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Post-Purchase Reflection
        </span>
      </div>

      {/* Order Info Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Order #{order.id}
          </span>
          <h3 className="text-xs font-bold text-white mt-0.5">
            {order.items.length} item{order.items.length > 1 ? 's' : ''} ({formatIDR(order.totalAmount)})
          </h3>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
          Delivered
        </span>
      </div>

      {/* Already Reflected Banner */}
      {existingReflection && (
        <div className="bg-blue-500/10 border border-blue-500/30 p-3.5 rounded-2xl text-xs text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>You have already submitted a reflection for this order. You can update it below.</span>
        </div>
      )}

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Question 1: Do you still want this? */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1. Do you still want this item today?</span>
          </label>
          <div className="flex flex-col gap-2">
            {stillWantedOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStillWanted(opt.value)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
                  stillWanted === opt.value
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Would you spend real money on this today? */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>2. Would you spend real money on this today?</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWouldBuyReal(true)}
              className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-center ${
                wouldBuyReal
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setWouldBuyReal(false)}
              className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-center ${
                !wouldBuyReal
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Question 3: Optional reason text box */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-200">
            What changed? <span className="text-slate-500 font-normal">(Optional explanation)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Realized I already have a similar item at home..."
            rows={3}
            className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-xs tracking-wide transition-all mt-2"
        >
          {isSubmitting ? 'Saving Reflection...' : 'Save Reflection'}
        </button>
      </form>
    </div>
  );
}
