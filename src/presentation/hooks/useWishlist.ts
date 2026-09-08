'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { Product } from '@/domain/models/Product';
import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';
import { db } from '@/infrastructure/db/dexie/ShoplessDexieDB';

export function useWishlist() {
  const { wishlist: wishlistRepo } = useRepositories();

  const items = useLiveQuery(
    async () => {
      return await db.wishlist.toArray();
    },
    [],
    []
  );

  const loading = items === undefined;

  const wishlistedProducts = useMemo(() => {
    if (!items) return [];
    return items
      .map((item) => staticCatalog.getProductById(item.productId))
      .filter((p): p is Product => p !== undefined);
  }, [items]);

  const toggleWishlist = async (productId: string) => {
    return await wishlistRepo.toggleWishlist(productId);
  };

  const isWishlisted = (productId: string) => {
    if (!items) return false;
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    wishlistedProducts,
    loading,
    toggleWishlist,
    isWishlisted,
  };
}
