'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, Package, BarChart2 } from 'lucide-react';
import { useOrders } from '@/presentation/hooks/useOrders';
import { ShoplessLogo } from './ShoplessLogo';

export function BottomNav() {
  const pathname = usePathname();
  const { ordersWithStatus } = useOrders();

  const activeOrdersCount = ordersWithStatus.length;
  const activeShippingCount = ordersWithStatus.filter((o) => !o.status.isDelivered).length;
  const showBadge = activeOrdersCount > 0;

  const navItems = [
    { href: '/', label: 'Beranda', isLogo: true },
    { href: '/shop', label: 'Jelajah', icon: Compass },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/orders', label: 'Pesanan', icon: Package, badge: showBadge },
    { href: '/insights', label: 'Ringkasan', icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 max-w-md mx-auto shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.isLogo ? (
                <ShoplessLogo
                  size={20}
                  className={`transition-all ${isActive ? 'scale-105 filter-none' : 'grayscale opacity-60 hover:opacity-100'}`}
                />
              ) : Icon ? (
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.75px]'}`} />
              ) : null}
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge ? (
                <span
                  className={`absolute top-1 right-2.5 w-2 h-2 rounded-full border border-white ${
                    activeShippingCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
