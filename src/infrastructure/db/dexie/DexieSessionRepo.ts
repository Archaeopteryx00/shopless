import { ISessionRepository } from '@/domain/repositories/ISessionRepository';
import { ShoppingSession } from '@/domain/models/Session';
import { db } from './ShoplessDexieDB';

export class DexieSessionRepo implements ISessionRepository {
  async getCurrentSession(): Promise<ShoppingSession | null> {
    const sessions = await db.sessions.toArray();
    if (sessions.length === 0) return null;
    sessions.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    return sessions[0];
  }

  async createSession(trigger?: string): Promise<ShoppingSession> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSession: ShoppingSession = {
      id,
      startedAt: new Date().toISOString(),
      trigger,
    };
    await db.sessions.put(newSession);
    return newSession;
  }

  async getAllSessions(): Promise<ShoppingSession[]> {
    return await db.sessions.toArray();
  }
}
