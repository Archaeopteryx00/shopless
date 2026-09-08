'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { Reflection, StillWantedOption } from '@/domain/models/Reflection';

export function useReflections() {
  const { reflection: reflectionRepo } = useRepositories();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReflections = useCallback(async () => {
    try {
      setLoading(true);
      const list = await reflectionRepo.getAllReflections();
      setReflections(list);
    } catch (err) {
      console.error('Failed to load reflections:', err);
    } finally {
      setLoading(false);
    }
  }, [reflectionRepo]);

  useEffect(() => {
    loadReflections();
  }, [loadReflections]);

  const saveReflection = async (data: {
    orderId: string;
    stillWanted: StillWantedOption;
    wouldBuyReal: boolean;
    reason?: string;
  }) => {
    const saved = await reflectionRepo.saveReflection(data);
    await loadReflections();
    return saved;
  };

  const getReflectionByOrderId = (orderId: string): Reflection | undefined => {
    return reflections.find((r) => r.orderId === orderId);
  };

  return {
    reflections,
    loading,
    saveReflection,
    getReflectionByOrderId,
    refreshReflections: loadReflections,
  };
}
