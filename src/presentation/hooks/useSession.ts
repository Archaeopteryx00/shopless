'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '@/infrastructure/db/RepositoryContext';
import { ShoppingSession } from '@/domain/models/Session';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useSession() {
  const { session: sessionRepo } = useRepositories();
  const [currentSession, setCurrentSession] = useState<ShoppingSession | null>(null);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const initSession = useCallback(async () => {
    try {
      setLoading(true);
      const session = await sessionRepo.getCurrentSession();
      
      if (session) {
        const sessionAge = Date.now() - new Date(session.startedAt).getTime();
        if (sessionAge > INACTIVITY_TIMEOUT_MS) {
          // Session expired due to inactivity (>30m), trigger new session prompt
          setShowTriggerModal(true);
        } else {
          setCurrentSession(session);
        }
      } else {
        // No session exists yet, prompt trigger modal
        setShowTriggerModal(true);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionRepo]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const selectTrigger = async (triggerOption?: string) => {
    const newSession = await sessionRepo.createSession(triggerOption);
    setCurrentSession(newSession);
    setShowTriggerModal(false);
    return newSession;
  };

  const skipTrigger = async () => {
    return await selectTrigger(undefined);
  };

  return {
    currentSession,
    showTriggerModal,
    setShowTriggerModal,
    selectTrigger,
    skipTrigger,
    loading,
  };
}
