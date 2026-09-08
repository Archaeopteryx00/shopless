'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { CartItem } from '@/domain/models/Cart';
import { OrderItem } from '@/domain/models/Order';
import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';
import { Product } from '@/domain/models/Product';

export interface DetailedCartItem {
  cartItem: CartItem;
  product: Product;
  itemTotal: number;
}

export function useCart() {
  const { cart: cartRepo, order: orderRepo, session: sessionRepo } = useRepositories();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const items = await cartRepo.getCart();
      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [cartRepo]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const detailedItems: DetailedCartItem[] = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = staticCatalog.getProductById(item.productId);
        if (!product) return null;
        return {
          cartItem: item,
          product,
          itemTotal: product.price * item.quantity,
        };
      })
      .filter((item): item is DetailedCartItem => item !== null);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return detailedItems.reduce((acc, curr) => acc + curr.itemTotal, 0);
  }, [detailedItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const updateQuantity = async (productId: string, quantity: number) => {
    await cartRepo.updateQuantity(productId, quantity);
    await loadCart();
  };

  const removeItem = async (productId: string) => {
    await cartRepo.removeItem(productId);
    await loadCart();
  };

  const clearCart = async () => {
    await cartRepo.clearCart();
    await loadCart();
  };

  const placeSimulatedOrder = async () => {
    if (detailedItems.length === 0) return null;

    const currentSession = await sessionRepo.getCurrentSession();

    // Snapshot product details into OrderItem array for historical stability
    const orderItemsSnapshot: OrderItem[] = detailedItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.cartItem.quantity,
      image: item.product.image,
      category: item.product.category,
      whyWanted: item.cartItem.whyWanted,
    }));

    const createdOrder = await orderRepo.createOrder({
      sessionId: currentSession?.id,
      items: orderItemsSnapshot,
      totalAmount: subtotal,
      shippingAddressName: 'Home',
      paymentMethodName: 'Shopless Simulation',
    });

    // Clear cart after order creation
    await clearCart();

    return createdOrder;
  };

  return {
    cartItems,
    detailedItems,
    subtotal,
    itemCount,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    placeSimulatedOrder,
    refreshCart: loadCart,
  };
}
