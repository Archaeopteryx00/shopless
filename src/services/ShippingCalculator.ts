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
    label: 'Order Confirmed',
    minHours: 0,
    maxHours: 1,
    description: 'Order placed & confirmed by merchant.',
  },
  {
    key: 'preparing',
    label: 'Preparing',
    minHours: 1,
    maxHours: 2,
    description: 'Merchant is carefully packing your item.',
  },
  {
    key: 'picked_up',
    label: 'Picked Up',
    minHours: 2,
    maxHours: 4,
    description: 'Courier picked up package from warehouse.',
  },
  {
    key: 'sorting_center',
    label: 'Sorting Center',
    minHours: 4,
    maxHours: 8,
    description: 'Package arrived at regional sorting hub.',
  },
  {
    key: 'in_transit',
    label: 'In Transit',
    minHours: 8,
    maxHours: 12,
    description: 'Package is moving between transport hubs.',
  },
  {
    key: 'local_facility',
    label: 'Local Facility',
    minHours: 12,
    maxHours: 18,
    description: 'Package arrived at your local delivery city facility.',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    minHours: 18,
    maxHours: 24,
    description: 'Courier is delivering package to your address.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    minHours: 24,
    maxHours: Infinity,
    description: 'Package delivered! Time to reflect on your purchase.',
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
      estimatedTimeRemainingText = 'Package Delivered';
    } else {
      const remainingHours = Math.max(0, 24 - elapsedHours);
      const remainingHoursReal = remainingHours / multiplier;
      if (remainingHoursReal < 1) {
        const remainingMins = Math.ceil(remainingHoursReal * 60);
        estimatedTimeRemainingText = `Est. arrival in ~${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
      } else {
        const h = Math.floor(remainingHoursReal);
        estimatedTimeRemainingText = `Est. arrival in ~${h} hour${h > 1 ? 's' : ''}`;
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
