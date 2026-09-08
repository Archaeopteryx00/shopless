import { IReflectionRepository } from '@/domain/repositories/IReflectionRepository';
import { Reflection } from '@/domain/models/Reflection';
import { db } from './ShoplessDexieDB';

export class DexieReflectionRepo implements IReflectionRepository {
  async getReflectionByOrderId(orderId: string): Promise<Reflection | null> {
    const reflections = await db.reflections.where('orderId').equals(orderId).toArray();
    return reflections[0] || null;
  }

  async saveReflection(
    reflectionData: Omit<Reflection, 'id' | 'createdAt'>
  ): Promise<Reflection> {
    const existing = await this.getReflectionByOrderId(reflectionData.orderId);
    if (existing) {
      const updated: Reflection = {
        ...existing,
        ...reflectionData,
      };
      await db.reflections.put(updated);
      return updated;
    }

    const id = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newReflection: Reflection = {
      ...reflectionData,
      id,
      createdAt: new Date().toISOString(),
    };
    await db.reflections.put(newReflection);
    return newReflection;
  }

  async getAllReflections(): Promise<Reflection[]> {
    return await db.reflections.toArray();
  }
}
