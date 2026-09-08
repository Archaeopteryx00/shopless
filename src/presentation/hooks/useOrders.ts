'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { Order } from '@/domain/models/Order';
import { ShippingCalculator, ShippingStatusResult } from '@/services/ShippingCalculator';

export interface OrderWithStatus {
  order: Order;
  status: ShippingStatusResult;
}

export function useOrders() {
  const { order: orderRepo } = useRepositories();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [speedMultiplier, setSpeedMultiplierState] = useState<number>(1);
  const [tick, setTick] = useState<number>(0);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const list = await orderRepo.getAllOrders();
      setOrders(list);

      // Check if any newly delivered orders require persistent deliveredAt timestamp
      for (const ord of list) {
        if (!ord.deliveredAt) {
          const status = ShippingCalculator.calculateStatus(ord);
          if (status.isDelivered) {
            await orderRepo.updateOrderDeliveredAt(ord.id, new Date().toISOString());
          }
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [orderRepo]);

  useEffect(() => {
    setSpeedMultiplierState(ShippingCalculator.getSpeedMultiplier());
    loadOrders();
  }, [loadOrders]);

  // Recalculate statuses on window focus / visibilitychange
  useEffect(() => {
    const handleFocus = () => {
      setTick((t) => t + 1);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    // Periodic check interval every 15 seconds to update active timeline indicators smoothly
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 15000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
      clearInterval(timer);
    };
  }, []);

  const changeSpeedMultiplier = (multiplier: number) => {
    ShippingCalculator.setSpeedMultiplier(multiplier);
    setSpeedMultiplierState(multiplier);
    setTick((t) => t + 1);
  };

  const ordersWithStatus: OrderWithStatus[] = useMemo(() => {
    const now = new Date();
    return orders.map((ord) => ({
      order: ord,
      status: ShippingCalculator.calculateStatus(ord, now),
    }));
  }, [orders, tick, speedMultiplier]);

  const deliveredOrdersCount = useMemo(() => {
    return ordersWithStatus.filter((o) => o.status.isDelivered).length;
  }, [ordersWithStatus]);

  const getOrderWithStatusById = (id: string): OrderWithStatus | undefined => {
    return ordersWithStatus.find((o) => o.order.id === id);
  };

  return {
    orders,
    ordersWithStatus,
    deliveredOrdersCount,
    speedMultiplier,
    changeSpeedMultiplier,
    getOrderWithStatusById,
    loading,
    refreshOrders: loadOrders,
  };
}
