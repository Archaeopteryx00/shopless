'use client';

import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { ProductCategory } from '@/domain/models/Product';

interface ReviewItem {
  id: string;
  avatarBg: string;
  avatarInitial: string;
  censoredName: string;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  likes: number;
}

interface ProductReviewsProps {
  category: ProductCategory;
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ category, rating, reviewCount }: ProductReviewsProps) {
  // Generate category-tailored realistic Indonesian reviews with censored names
  const getReviews = (cat: ProductCategory): ReviewItem[] => {
    switch (cat) {
      case 'Tech':
        return [
          {
            id: 'rev-1',
            avatarBg: 'bg-indigo-500',
            avatarInitial: 'B',
            censoredName: 'b***g',
            rating: 5,
            date: '2 hari lalu',
            variant: 'Warna: Hitam Matte',
            comment: 'Pengiriman sangat cepat! Barang ori 100%, berfungsi normal tanpa kendala. Packing bubble wrap tebal banget aman ⚡',
            likes: 12,
          },
          {
            id: 'rev-2',
            avatarBg: 'bg-emerald-500',
            avatarInitial: 'R',
            censoredName: 'r***i',
            rating: 5,
            date: '1 minggu lalu',
            variant: 'Warna: Silver Premium',
            comment: 'Kualitas mantap untuk harga segini. Baterai awet & kualitas build-nya kokoh banget. Recommended seller 👍',
            likes: 7,
          },
          {
            id: 'rev-3',
            avatarBg: 'bg-amber-500',
            avatarInitial: 'A',
            censoredName: 'a***9',
            rating: 5,
            date: '28 Agu 2026',
            variant: 'Default',
            comment: 'Sesuai ekspektasi! Pengemasan rapi dan tidak ada cacat fisik. Langsung dipake kerja lancar jaya.',
            likes: 4,
          },
        ];
      case 'Fashion':
        return [
          {
            id: 'rev-1',
            avatarBg: 'bg-rose-500',
            avatarInitial: 'S',
            censoredName: 's***a',
            rating: 5,
            date: 'Kemarin',
            variant: 'Ukuran: L',
            comment: 'Bahannya adem banget dan jahitan rapih. Warna pas sesuai foto di produk. Bakal langganan deh di toko ini! ❤️',
            likes: 9,
          },
          {
            id: 'rev-2',
            avatarBg: 'bg-purple-500',
            avatarInitial: 'D',
            censoredName: 'd***0',
            rating: 5,
            date: '3 hari lalu',
            variant: 'Ukuran: XL',
            comment: 'Real pict! Ukuran pas di badan dan bahannya gak gampang kusut. Pengiriman kilat cuma sehari sampe.',
            likes: 5,
          },
        ];
      default:
        return [
          {
            id: 'rev-1',
            avatarBg: 'bg-blue-500',
            avatarInitial: 'M',
            censoredName: 'm***8',
            rating: 5,
            date: '2 hari lalu',
            variant: 'Varian: Original',
            comment: 'Barang datang dalam kondisi sangat baik. Sesuai deskripsi dan fast response dari penjual. Terima kasih!',
            likes: 11,
          },
          {
            id: 'rev-2',
            avatarBg: 'bg-teal-500',
            avatarInitial: 'K',
            censoredName: 'k***9',
            rating: 5,
            date: '5 hari lalu',
            variant: 'Varian: Standard',
            comment: 'Bagus banget produknya, harga bersahabat dan sesuai ekspektasi. Packaging sangat rapih dan aman.',
            likes: 6,
          },
          {
            id: 'rev-3',
            avatarBg: 'bg-orange-500',
            avatarInitial: 'F',
            censoredName: 'f***z',
            rating: 4,
            date: '24 Agu 2026',
            variant: 'Varian: Default',
            comment: 'Produk oke banget, kualitas rapih. Cuma kurirnya agak lama tapi barang tetep sampai dengan aman.',
            likes: 3,
          },
        ];
    }
  };

  const reviews = getReviews(category);

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3.5">
      {/* Header & Rating Summary */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900">Ulasan Pembeli</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800">{rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400 font-normal">({reviewCount} ulasan)</span>
          </div>
        </div>

        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md font-semibold">
          ✓ 98% Pembeli Puas
        </span>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
            {/* User row: Avatar + Censored Name + Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div
                  className={`w-6 h-6 rounded-full ${rev.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shadow-xs shrink-0`}
                >
                  {rev.avatarInitial}
                </div>
                {/* Censored Name */}
                <span className="text-xs font-bold text-slate-800 tracking-wide">
                  {rev.censoredName}
                </span>
              </div>

              {/* Date */}
              <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
            </div>

            {/* Stars & Variant */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-normal">{rev.variant}</span>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {rev.comment}
            </p>

            {/* Helpful / Likes counter */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <ThumbsUp className="w-2.5 h-2.5 text-slate-400" />
              <span>Membantu ({rev.likes})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
