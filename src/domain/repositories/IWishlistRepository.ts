import { WishlistItem } from '../models/Wishlist';

export interface IWishlistRepository {
  getWishlist(): Promise<WishlistItem[]>;
  toggleWishlist(productId: string): Promise<boolean>;
  isWishlisted(productId: string): Promise<boolean>;
}
