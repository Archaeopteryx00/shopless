import Dexie, { Table } from 'dexie';
import { ShoppingSession } from '@/domain/models/Session';
import { CartItem } from '@/domain/models/Cart';
import { WishlistItem } from '@/domain/models/Wishlist';
import { Order } from '@/domain/models/Order';
import { Reflection } from '@/domain/models/Reflection';

export class ShoplessDexieDB extends Dexie {
  sessions!: Table<ShoppingSession, string>;
  cart!: Table<CartItem, string>;
  wishlist!: Table<WishlistItem, string>;
  orders!: Table<Order, string>;
  reflections!: Table<Reflection, string>;

  constructor() {
    super('ShoplessDB');
    this.version(1).stores({
      sessions: 'id, startedAt',
      cart: 'productId, addedAt, sessionId',
      wishlist: 'productId, addedAt',
      orders: 'id, createdAt, sessionId',
      reflections: 'id, orderId, createdAt',
    });
  }
}

export const db = new ShoplessDexieDB();
