import { ICartRepository } from '@/domain/repositories/ICartRepository';
import { CartItem } from '@/domain/models/Cart';
import { db } from './ShoplessDexieDB';

export class DexieCartRepo implements ICartRepository {
  async getCart(): Promise<CartItem[]> {
    return await db.cart.toArray();
  }

  async addItem(item: Omit<CartItem, 'addedAt'>): Promise<void> {
    const existing = await db.cart.get(item.productId);
    if (existing) {
      await db.cart.update(item.productId, {
        quantity: existing.quantity + item.quantity,
        whyWanted: item.whyWanted || existing.whyWanted,
      });
    } else {
      await db.cart.put({
        ...item,
        addedAt: new Date().toISOString(),
      });
    }
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await db.cart.delete(productId);
    } else {
      await db.cart.update(productId, { quantity });
    }
  }

  async removeItem(productId: string): Promise<void> {
    await db.cart.delete(productId);
  }

  async clearCart(): Promise<void> {
    await db.cart.clear();
  }
}
