export const CACHE_TOKEN = 'ICache';

export interface ICache {
  getOrSet<T>(key: string, dbCallback: () => Promise<T>): Promise<T>;
  safeSet(key: string, value: string, ttlSeconds: number): Promise<boolean>;
  safeDel(key: string): Promise<boolean>;
}
