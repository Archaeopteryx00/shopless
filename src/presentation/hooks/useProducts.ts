'use client';

import { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/domain/models/Product';
import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';

export function useProducts() {
  const [category, setCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = useMemo(() => staticCatalog.getAllProducts(), []);
  
  const filteredProducts = useMemo(() => {
    return staticCatalog.searchProducts(searchQuery, category);
  }, [searchQuery, category]);

  const deals = useMemo(() => staticCatalog.getDeals(6), []);
  const popular = useMemo(() => staticCatalog.getPopularProducts(6), []);
  const forYou = useMemo(() => staticCatalog.getForYouProducts(12), []);

  return {
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    allProducts,
    filteredProducts,
    deals,
    popular,
    forYou,
    getProductById: (id: string) => staticCatalog.getProductById(id),
  };
}
