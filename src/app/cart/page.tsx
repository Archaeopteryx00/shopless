'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/presentation/hooks/useCart';
import { ProductImage } from '@/presentation/components/marketplace/ProductImage';
import { formatIDR } from '@/presentation/components/marketplace/ProductCard';
import { Order } from '@/domain/models/Order';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  CreditCard,
  Package,
} from 'lucide-react';

export default function CartPage() {
  const {
    detailedItems,
    subtotal,
    itemCount,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    placeSimulatedOrder,
  } = useCart();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-xs">
        Memuat keranjang...
      </div>
    );
  }

  // State 3: Order Placed Confirmation Screen
  if (placedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center gap-4 animate-fadeIn py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs mb-1">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
            Pesanan Berhasil Dibuat!
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Order #{placedOrder.id}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dibuat pada {new Date(placedOrder.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="w-full bg-white rounded-xl p-4 my-2 text-left flex flex-col gap-3 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-500">Jumlah Barang</span>
            <span className="text-slate-900 font-semibold">{placedOrder.items.length} barang</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-500">Total Belanja Simulasi</span>
            <span className="text-slate-900 font-bold">{formatIDR(placedOrder.totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Uang Sungguhan Dikeluarkan</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Rp 0
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          <Link
            href="/orders"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Lacak Pesanan</span>
          </Link>

          <Link
            href="/shop"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
          >
            <span>Lanjut Jelajah</span>
          </Link>
        </div>
      </div>
    );
  }

  // State 1: Cart Empty
  if (detailedItems.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center text-slate-500 my-8 flex flex-col items-center gap-3 border border-slate-200 shadow-xs">
        <ShoppingCart className="w-12 h-12 text-slate-300 stroke-1" />
        <div>
          <h3 className="text-sm font-bold text-slate-800">Keranjang masih kosong</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            Yuk, cari barang yang kamu suka di katalog.
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
        >
          <span>Jelajah Katalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const order = await placeSimulatedOrder();
      if (order) {
        setPlacedOrder(order);
      }
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-slate-900">
            {isCheckoutStep ? 'Checkout' : 'Keranjang'}
          </h1>
        </div>
        {!isCheckoutStep && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" /> Kosongkan Keranjang
          </button>
        )}
      </div>

      {!isCheckoutStep ? (
        /* STEP 1: Cart Items List & Summary */
        <>
          <div className="flex flex-col gap-3">
            {detailedItems.map(({ cartItem, product, itemTotal }) => (
              <div
                key={cartItem.productId}
                className="bg-white p-3 rounded-xl flex gap-3 items-center border border-slate-200 shadow-xs relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 shrink-0">
                  <ProductImage
                    category={product.category}
                    name={product.name}
                    className="w-full h-full"
                    size="sm"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-slate-900 truncate">{product.name}</h3>
                  <span className="text-[10px] text-blue-600 font-medium">{product.category}</span>
                  {cartItem.whyWanted && (
                    <span className="block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 mt-1 w-fit truncate max-w-[180px]">
                      Alasan: {cartItem.whyWanted}
                    </span>
                  )}
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {formatIDR(product.price)}
                  </div>
                </div>

                {/* Quantity & Delete */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => removeItem(cartItem.productId)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    aria-label="Hapus barang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-900 min-w-[20px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartItem.productId, cartItem.quantity + 1)}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shopping Summary Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Total Barang ({itemCount})</span>
              <span className="text-slate-800 font-semibold">{formatIDR(subtotal)}</span>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Total Belanja</span>
                <span className="text-slate-900 text-base">{formatIDR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                <span className="text-emerald-700">Total Bayar Sungguhan</span>
                <span className="text-emerald-700 text-sm">Rp 0</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Ini simulasi — kamu tidak akan dikenakan biaya apa pun.
            </p>
          </div>

          {/* Checkout Action CTA */}
          <button
            type="button"
            onClick={() => setIsCheckoutStep(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-xs tracking-wide transition-all mt-1"
          >
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        /* STEP 2: Simulated Checkout View */
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Shipping Address Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Alamat Pengiriman</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">Rumah</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Simulasi pengiriman lokal (Tanpa alamat asli)
              </p>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Metode Pembayaran</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Shopless Pay</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Tidak ada pembayaran sungguhan</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                AKTIF
              </span>
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ringkasan Pesanan ({detailedItems.length} barang)
            </h3>
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {detailedItems.map(({ product, cartItem }) => (
                <div key={product.id} className="flex justify-between items-center text-xs text-slate-700">
                  <span className="truncate max-w-[200px]">
                    {product.name} <span className="text-slate-400">x{cartItem.quantity}</span>
                  </span>
                  <span className="font-semibold text-slate-900">{formatIDR(product.price * cartItem.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Belanja Simulasi</span>
                <span className="text-slate-900 font-bold">{formatIDR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                <span className="text-emerald-700">Total Bayar Sungguhan</span>
                <span className="text-emerald-700 text-sm">Rp 0</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setIsCheckoutStep(false)}
              className="px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-all"
            >
              Kembali
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-75 disabled:cursor-wait text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-xs tracking-wide transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses Pesanan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Buat Pesanan ({formatIDR(subtotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
