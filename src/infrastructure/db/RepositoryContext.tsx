'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ICartRepository } from '@/domain/repositories/ICartRepository';
import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { IReflectionRepository } from '@/domain/repositories/IReflectionRepository';
import { ISessionRepository } from '@/domain/repositories/ISessionRepository';
import { IWishlistRepository } from '@/domain/repositories/IWishlistRepository';

import { DexieCartRepo } from './dexie/DexieCartRepo';
import { DexieOrderRepo } from './dexie/DexieOrderRepo';
import { DexieReflectionRepo } from './dexie/DexieReflectionRepo';
import { DexieSessionRepo } from './dexie/DexieSessionRepo';
import { DexieWishlistRepo } from './dexie/DexieWishlistRepo';

export interface RepositoryContainer {
  cart: ICartRepository;
  order: IOrderRepository;
  reflection: IReflectionRepository;
  session: ISessionRepository;
  wishlist: IWishlistRepository;
}

// Default to Dexie IndexedDB implementations
const defaultRepositories: RepositoryContainer = {
  cart: new DexieCartRepo(),
  order: new DexieOrderRepo(),
  reflection: new DexieReflectionRepo(),
  session: new DexieSessionRepo(),
  wishlist: new DexieWishlistRepo(),
};

const RepositoryContext = createContext<RepositoryContainer>(defaultRepositories);

export function RepositoryProvider({
  children,
  repositories = defaultRepositories,
}: {
  children: ReactNode;
  repositories?: RepositoryContainer;
}) {
  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories(): RepositoryContainer {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
}
