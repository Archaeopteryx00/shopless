'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-xs">
        Loading cart...
      </div>
    );
  }

  // State 3: Order Placed Confirmation Screen
  if (placedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center gap-4 animate-fadeIn py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-xl shadow-emerald-500/10 mb-1">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
            Order Placed
          </span>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Order #{placedOrder.id}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(placedOrder.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="w-full glass-panel rounded-2xl p-4 my-2 text-left flex flex-col gap-3 border border-slate-800">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Items Ordered</span>
            <span className="text-slate-200 font-semibold">{placedOrder.items.length} items</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400">Simulated Total</span>
            <span className="text-slate-100 font-bold">{formatIDR(placedOrder.totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Real Money Spent</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Rp 0
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          <Link
            href="/orders"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Track Simulated Shipment</span>
          </Link>

          <Link
            href="/shop"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <span>Continue Browsing</span>
          </Link>
        </div>
      </div>
    );
  }

  // State 1: Cart Empty
  if (detailedItems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-slate-400 my-8 flex flex-col items-center gap-3">
        <ShoppingCart className="w-12 h-12 text-slate-600 stroke-1" />
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Your cart is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Browse our catalog and add items to simulate your shopping experience.
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-3 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
        >
          <span>Browse Marketplace</span>
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
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-bold text-slate-100">
            {isCheckoutStep ? 'Simulated Checkout' : 'Your Cart'}
          </h1>
        </div>
        {!isCheckoutStep && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
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
                className="glass-panel p-3 rounded-2xl flex gap-3 items-center border border-slate-800 relative group"
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
                  <h3 className="text-xs font-semibold text-slate-100 truncate">{product.name}</h3>
                  <span className="text-[10px] text-blue-400 font-medium">{product.category}</span>
                  {cartItem.whyWanted && (
                    <span className="block text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 mt-1 w-fit truncate max-w-[180px]">
                      Motivation: {cartItem.whyWanted}
                    </span>
                  )}
                  <div className="text-xs font-bold text-white mt-1">
                    {formatIDR(product.price)}
                  </div>
                </div>

                {/* Quantity & Delete */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => removeItem(cartItem.productId)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-100 min-w-[20px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(cartItem.productId, cartItem.quantity + 1)}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated Spending Summary Box */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Items ({itemCount})</span>
              <span className="text-slate-200 font-semibold">{formatIDR(subtotal)}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">Simulated Spending</span>
                <span className="text-white text-base">{formatIDR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                <span className="text-emerald-400">Real Money Spent</span>
                <span className="text-emerald-400 text-sm">Rp 0</span>
              </div>
            </div>
          </div>

          {/* Proceed to Checkout CTA */}
          <button
            type="button"
            onClick={() => setIsCheckoutStep(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs tracking-wide transition-all mt-1"
          >
            <span>Proceed to Simulated Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        /* STEP 2: Simulated Checkout View */
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Shipping Address Box */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Shipping Address</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs">
              <p className="font-bold text-slate-100">Home</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Simulated Local Delivery (No real address needed)
              </p>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Method</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-100">Shopless Simulation</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Virtual 100% Free Transaction</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Order Summary ({detailedItems.length} items)
            </h3>
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {detailedItems.map(({ product, cartItem }) => (
                <div key={product.id} className="flex justify-between items-center text-xs text-slate-300">
                  <span className="truncate max-w-[200px]">
                    {product.name} <span className="text-slate-500">x{cartItem.quantity}</span>
                  </span>
                  <span className="font-medium text-white">{formatIDR(product.price * cartItem.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Simulated Spending</span>
                <span className="text-white font-bold">{formatIDR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                <span className="text-emerald-400">Actual Money Required</span>
                <span className="text-emerald-400 text-sm">Rp 0</span>
              </div>
            </div>
          </div>

          {/* Security guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero payment info collected. Pure shopping simulation.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setIsCheckoutStep(false)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Back to Cart
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs tracking-wide transition-all"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order ({formatIDR(subtotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
