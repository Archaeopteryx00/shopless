import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { Order } from '@/domain/models/Order';
import { db } from './ShoplessDexieDB';

export class DexieOrderRepo implements IOrderRepository {
  async getAllOrders(): Promise<Order[]> {
    const orders = await db.orders.toArray();
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await db.orders.get(id);
    return order || null;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `SL-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
    };
    await db.orders.put(newOrder);
    return newOrder;
  }

  async updateOrderDeliveredAt(id: string, deliveredAt: string): Promise<void> {
    await db.orders.update(id, { deliveredAt });
  }
}
