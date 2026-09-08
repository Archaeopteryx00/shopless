import { Order } from '@/domain/models/Order';

export type ShippingStageKey =
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'sorting_center'
  | 'in_transit'
  | 'local_facility'
  | 'out_for_delivery'
  | 'delivered';

export interface ShippingStageInfo {
  key: ShippingStageKey;
  label: string;
  minHours: number;
  maxHours: number;
  description: string;
}

export const SHIPPING_STAGES: ShippingStageInfo[] = [
  {
    key: 'confirmed',
    label: 'Pesanan dibuat',
    minHours: 0,
    maxHours: 1,
    description: 'Pesanan telah berhasil dibuat dan dikonfirmasi penjual.',
  },
  {
    key: 'preparing',
    label: 'Sedang diproses',
    minHours: 1,
    maxHours: 2,
    description: 'Penjual sedang meyiapkan dan mengemas barang pesananmu.',
  },
  {
    key: 'picked_up',
    label: 'Sudah diambil kurir',
    minHours: 2,
    maxHours: 4,
    description: 'Paket telah diserahkan penjual ke kurir pengiriman.',
  },
  {
    key: 'sorting_center',
    label: 'Tiba di pusat sortir',
    minHours: 4,
    maxHours: 8,
    description: 'Paket sedang dikelompokkan di gudang sortir regional.',
  },
  {
    key: 'in_transit',
    label: 'Sedang dalam perjalanan',
    minHours: 8,
    maxHours: 12,
    description: 'Paket dalam perjalanan antar kota tujuan.',
  },
  {
    key: 'local_facility',
    label: 'Tiba di kota tujuan',
    minHours: 12,
    maxHours: 18,
    description: 'Paket tiba di hub pengiriman daerah tujuanmu.',
  },
  {
    key: 'out_for_delivery',
    label: 'Sedang diantar',
    minHours: 18,
    maxHours: 24,
    description: 'Kurir sedang menuju ke alamat pengirimanmu.',
  },
  {
    key: 'delivered',
    label: 'Pesanan diterima',
    minHours: 24,
    maxHours: Infinity,
    description: 'Paket sudah sampai! Yuk, refleksikan pesananmu.',
  },
];

export interface ShippingStatusResult {
  currentStage: ShippingStageInfo;
  stageIndex: number; // 0 to 7
  elapsedHours: number;
  progressPercent: number; // 0 to 100
  isDelivered: boolean;
  estimatedTimeRemainingText: string;
}

const SPEED_MULTIPLIER_KEY = 'shopless_speed_multiplier';

export class ShippingCalculator {
  static getSpeedMultiplier(): number {
    if (typeof window === 'undefined') return 1;
    const val = localStorage.getItem(SPEED_MULTIPLIER_KEY);
    return val ? parseFloat(val) : 1;
  }

  static setSpeedMultiplier(multiplier: number): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SPEED_MULTIPLIER_KEY, multiplier.toString());
    }
  }

  static calculateStatus(order: Order, now = new Date()): ShippingStatusResult {
    const multiplier = this.getSpeedMultiplier();
    const createdTime = new Date(order.createdAt).getTime();
    const currentTime = now.getTime();
    const rawElapsedMs = Math.max(0, currentTime - createdTime);

    // Apply speed multiplier
    const effectiveElapsedMs = rawElapsedMs * multiplier;
    const elapsedHours = effectiveElapsedMs / (1000 * 60 * 60);

    let stageIndex = 0;
    for (let i = 0; i < SHIPPING_STAGES.length; i++) {
      if (elapsedHours >= SHIPPING_STAGES[i].minHours) {
        stageIndex = i;
      }
    }

    const currentStage = SHIPPING_STAGES[stageIndex];
    const isDelivered = stageIndex === 7 || elapsedHours >= 24;
    const progressPercent = Math.min(100, Math.round((elapsedHours / 24) * 100));

    let estimatedTimeRemainingText = '';
    if (isDelivered) {
      estimatedTimeRemainingText = 'Pesanan Diterima';
    } else {
      const remainingHours = Math.max(0, 24 - elapsedHours);
      const remainingHoursReal = remainingHours / multiplier;
      if (remainingHoursReal < 1) {
        const remainingMins = Math.ceil(remainingHoursReal * 60);
        estimatedTimeRemainingText = `Perkiraan tiba ~${remainingMins} menit`;
      } else {
        const h = Math.floor(remainingHoursReal);
        estimatedTimeRemainingText = `Perkiraan tiba ~${h} jam`;
      }
    }

    return {
      currentStage,
      stageIndex,
      elapsedHours,
      progressPercent,
      isDelivered,
      estimatedTimeRemainingText,
    };
  }
}
