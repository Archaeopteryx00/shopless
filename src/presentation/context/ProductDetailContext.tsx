'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useProducts } from '@/presentation/hooks/useProducts';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';

interface ProductDetailContextType {
  quantity: number;
  setQuantity: (q: number | ((prev: number) => number)) => void;
  whyWanted: string;
  setWhyWanted: (w: string) => void;
  addState: 'idle' | 'adding' | 'added';
  buyNowState: 'idle' | 'processing';
  toastMessage: string | null;
  toastType: 'success' | 'wishlist';
  setToastMessage: (msg: string | null) => void;
  setToastType: (t: 'success' | 'wishlist') => void;
  handleAddToCart: () => Promise<void>;
  handleBuyNow: () => Promise<void>;
  isProductDetail: boolean;
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export function ProductDetailProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { getProductById } = useProducts();
  const { cart: cartRepo } = useRepositories();

  const [quantity, setQuantity] = useState(1);
  const [whyWanted, setWhyWanted] = useState('');
  const [addState, setAddState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [buyNowState, setBuyNowState] = useState<'idle' | 'processing'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'wishlist'>('success');

  const isProductDetail = pathname.startsWith('/shop/') && pathname !== '/shop';
  const productId = isProductDetail ? pathname.replace('/shop/', '').split('?')[0] : '';

  // Reset state when path changes
  useEffect(() => {
    setQuantity(1);
    setWhyWanted('');
    setAddState('idle');
    setBuyNowState('idle');
    setToastMessage(null);
  }, [pathname]);

  const handleAddToCart = async () => {
    if (!isProductDetail || !productId || addState !== 'idle') return;
    const product = getProductById(productId);
    if (!product) return;

    setAddState('adding');
    await cartRepo.addItem({
      productId: product.id,
      quantity,
      whyWanted: whyWanted || undefined,
    });
    setAddState('added');
    setToastType('success');
    setToastMessage('Berhasil ditambah ke keranjang!');
    setTimeout(() => setToastMessage(null), 2500);
    setTimeout(() => setAddState('idle'), 1500);
  };

  const handleBuyNow = async () => {
    if (!isProductDetail || !productId || buyNowState !== 'idle') return;
    const product = getProductById(productId);
    if (!product) return;

    setBuyNowState('processing');
    await cartRepo.addItem({
      productId: product.id,
      quantity,
      whyWanted: whyWanted || undefined,
    });
    router.push('/cart?checkout=true');
  };

  return (
    <ProductDetailContext.Provider
      value={{
        quantity,
        setQuantity,
        whyWanted,
        setWhyWanted,
        addState,
        buyNowState,
        toastMessage,
        toastType,
        setToastMessage,
        setToastType,
        handleAddToCart,
        handleBuyNow,
        isProductDetail,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
}

export function useProductDetailContext() {
  const context = useContext(ProductDetailContext);
  if (!context) {
    throw new Error('useProductDetailContext must be used within a ProductDetailProvider');
  }
  return context;
}
