'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Star, MessageSquare, Clock, UserPlus, Check } from 'lucide-react';
import { ProductCategory } from '@/domain/models/Product';

interface StoreCardProps {
  category: ProductCategory;
}

export function StoreCard({ category }: StoreCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const getStoreInfo = (cat: ProductCategory) => {
    switch (cat) {
      case 'Tech':
        return { name: 'Tech Gadget Official', location: 'Jakarta Barat', rating: '4.9', chat: '99%', badge: 'Official Store' };
      case 'Books & Learning':
        return { name: 'Pustaka Loka Store', location: 'Kota Yogyakarta', rating: '4.8', chat: '98%', badge: 'Star Seller' };
      case 'Lifestyle':
        return { name: 'Daily Living ID', location: 'Kab. Tangerang', rating: '4.9', chat: '97%', badge: 'Star Seller' };
      case 'Fashion':
        return { name: 'Urban Style Supply', location: 'Kota Bandung', rating: '4.8', chat: '96%', badge: 'Official Store' };
      case 'Hobbies':
        return { name: 'Hobby & Craft Studio', location: 'Jakarta Selatan', rating: '4.9', chat: '99%', badge: 'Star Seller' };
      default:
        return { name: 'Shopless Mart Official', location: 'Jakarta Selatan', rating: '4.9', chat: '98%', badge: 'Official Store' };
    }
  };

  const store = getStoreInfo(category);

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
      {/* Store Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 relative">
            <Store className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 truncate">{store.name}</h4>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-0.5 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                {store.badge}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium truncate">{store.location}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
              isFollowing
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3 h-3 text-slate-600" />
                <span>Mengikuti</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 text-blue-600" />
                <span>+ Ikuti</span>
              </>
            )}
          </button>

          <Link
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-semibold transition-all"
          >
            Toko
          </Link>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{store.rating}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Rating Toko</span>
        </div>

        <div className="flex flex-col items-center border-x border-slate-100">
          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
            <MessageSquare className="w-3 h-3 text-slate-500" />
            <span>{store.chat}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Performa Chat</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>&lt; 1 jam</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Waktu Balas</span>
        </div>
      </div>
    </div>
  );
}
