import { IWishlistRepository } from '@/domain/repositories/IWishlistRepository';
import { WishlistItem } from '@/domain/models/Wishlist';
import { db } from './ShoplessDexieDB';

export class DexieWishlistRepo implements IWishlistRepository {
  async getWishlist(): Promise<WishlistItem[]> {
    return await db.wishlist.toArray();
  }

  async toggleWishlist(productId: string): Promise<boolean> {
    const existing = await db.wishlist.get(productId);
    if (existing) {
      await db.wishlist.delete(productId);
      return false; // Now removed
    } else {
      await db.wishlist.put({
        productId,
        addedAt: new Date().toISOString(),
      });
      return true; // Now added
    }
  }

  async isWishlisted(productId: string): Promise<boolean> {
    const item = await db.wishlist.get(productId);
    return !!item;
  }
}
