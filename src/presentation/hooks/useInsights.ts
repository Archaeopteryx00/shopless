'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { InsightsCalculator, BehavioralInsights } from '@/services/InsightsCalculator';

export function useInsights() {
  const { session: sessionRepo, order: orderRepo, reflection: reflectionRepo } = useRepositories();

  const [sessions, setSessions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sList, oList, rList] = await Promise.all([
        sessionRepo.getAllSessions(),
        orderRepo.getAllOrders(),
        reflectionRepo.getAllReflections(),
      ]);
      setSessions(sList);
      setOrders(oList);
      setReflections(rList);
    } catch (err) {
      console.error('Failed to load insights data:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionRepo, orderRepo, reflectionRepo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const insights: BehavioralInsights = useMemo(() => {
    return InsightsCalculator.calculate(sessions, orders, reflections);
  }, [sessions, orders, reflections]);

  return {
    insights,
    loading,
    refreshInsights: loadData,
  };
}
