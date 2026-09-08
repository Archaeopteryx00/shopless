import { CartItem } from '../models/Cart';

export interface ICartRepository {
  getCart(): Promise<CartItem[]>;
  addItem(item: Omit<CartItem, 'addedAt'>): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  removeItem(productId: string): Promise<void>;
  clearCart(): Promise<void>;
}
