'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { WishlistItem } from '@/domain/models/Wishlist';
import { Product } from '@/domain/models/Product';
import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';

export function useWishlist() {
  const { wishlist: wishlistRepo } = useRepositories();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const list = await wishlistRepo.getWishlist();
      setItems(list);
      
      const products = list
        .map((item) => staticCatalog.getProductById(item.productId))
        .filter((p): p is Product => p !== undefined);

      setWishlistedProducts(products);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [wishlistRepo]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggleWishlist = async (productId: string) => {
    const isNowWishlisted = await wishlistRepo.toggleWishlist(productId);
    await loadWishlist();
    return isNowWishlisted;
  };

  const isWishlisted = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    wishlistedProducts,
    loading,
    toggleWishlist,
    isWishlisted,
    refresh: loadWishlist,
  };
}
