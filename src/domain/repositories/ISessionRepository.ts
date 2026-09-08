import { ShoppingSession } from '../models/Session';

export interface ISessionRepository {
  getCurrentSession(): Promise<ShoppingSession | null>;
  createSession(trigger?: string): Promise<ShoppingSession>;
  getAllSessions(): Promise<ShoppingSession[]>;
}
