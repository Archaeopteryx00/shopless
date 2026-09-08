import { Reflection } from '../models/Reflection';

export interface IReflectionRepository {
  getReflectionByOrderId(orderId: string): Promise<Reflection | null>;
  saveReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Promise<Reflection>;
  getAllReflections(): Promise<Reflection[]>;
}
