import { Order } from '../models/Order';

export interface IOrderRepository {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  updateOrderDeliveredAt(id: string, deliveredAt: string): Promise<void>;
}
