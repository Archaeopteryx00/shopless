import { Order } from '@/domain/models/Order';
import { Reflection } from '@/domain/models/Reflection';
import { ShoppingSession } from '@/domain/models/Session';

export interface BehavioralInsights {
  totalSessions: number;
  totalPurchases: number;
  totalSimulatedSpending: number;
  totalRealMoneySpent: number; // Always 0
  totalReflections: number;
  stillWantedCount: number;
  persistenceRate: number; // 0 to 100
  wouldNotBuyRealCount: number;
  wouldNotBuyRealPercent: number; // 0 to 100
  hasReflections: boolean;
  insightSummaryMessage: string;
}

export class InsightsCalculator {
  static calculate(
    sessions: ShoppingSession[],
    orders: Order[],
    reflections: Reflection[]
  ): BehavioralInsights {
    const totalSessions = sessions.length;
    const totalPurchases = orders.length;
    const totalSimulatedSpending = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalRealMoneySpent = 0;

    const totalReflections = reflections.length;
    const hasReflections = totalReflections > 0;

    // Explicit definition: "still wanted" = 'yes' OR 'probably'
    const stillWantedCount = reflections.filter(
      (r) => r.stillWanted === 'yes' || r.stillWanted === 'probably'
    ).length;

    const persistenceRate = hasReflections
      ? Math.round((stillWantedCount / totalReflections) * 100)
      : 0;

    const wouldNotBuyRealCount = reflections.filter((r) => !r.wouldBuyReal).length;
    const wouldNotBuyRealPercent = hasReflections
      ? Math.round((wouldNotBuyRealCount / totalReflections) * 100)
      : 0;

    let insightSummaryMessage = 'No reflection data available yet.';
    if (hasReflections) {
      insightSummaryMessage = `${stillWantedCount} of your ${totalReflections} simulated purchase${
        totalReflections > 1 ? 's were' : ' was'
      } still wanted after the 24h cooling-off period.`;
    }

    return {
      totalSessions,
      totalPurchases,
      totalSimulatedSpending,
      totalRealMoneySpent,
      totalReflections,
      stillWantedCount,
      persistenceRate,
      wouldNotBuyRealCount,
      wouldNotBuyRealPercent,
      hasReflections,
      insightSummaryMessage,
    };
  }
}
