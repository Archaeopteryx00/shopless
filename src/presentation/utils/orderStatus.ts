import { ShippingStageKey } from '@/services/ShippingCalculator';

export type MarketplaceStatusKey = 'all' | 'dikemas' | 'dikirim' | 'selesai';

export interface MarketplaceStatusInfo {
  key: 'dikemas' | 'dikirim' | 'selesai';
  label: string;
  badgeClass: string;
}

export function getMarketplaceStatus(stageKey: ShippingStageKey): MarketplaceStatusInfo {
  switch (stageKey) {
    case 'confirmed':
    case 'preparing':
      return {
        key: 'dikemas',
        label: 'Dikemas',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'picked_up':
    case 'sorting_center':
    case 'in_transit':
    case 'local_facility':
    case 'out_for_delivery':
      return {
        key: 'dikirim',
        label: 'Dikirim',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    case 'delivered':
    default:
      return {
        key: 'selesai',
        label: 'Selesai',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
  }
}
