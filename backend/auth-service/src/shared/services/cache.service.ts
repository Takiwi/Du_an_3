import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { RedisService } from '../database/redis.service';

export interface ICache {
  getOrSet<T>(key: string, dbCallback: () => Promise<T>): Promise<T>;
  safeSet(key: string, value: string, ttlSeconds: number): Promise<boolean>;
  safeDel(key: string): Promise<boolean>;
}

@Injectable()
export class CacheService implements ICache {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async getOrSet<T>(key: string, dbCallback: () => Promise<T>): Promise<T> {
    try {
      const cacheData = await this.redis.get(key);
      if (cacheData) return JSON.parse(cacheData) as T;
    } catch (error) {
      this.logger.warn(
        `[Redis GET Failed] Key: ${key}. Chuyển hướng sang DB. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const dbData = await dbCallback();
    const ttlSeconds = this.configService.getOrThrow<number>('redis.ttlCache');

    if (dbData !== null && dbData !== undefined) {
      this.safeSet(key, JSON.stringify(dbData), ttlSeconds).catch(() => {});
    }

    return dbData;
  }

  async safeSet(
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<boolean> {
    try {
      await this.redis.set(key, value, 'EX', ttlSeconds);
      return true;
    } catch (error) {
      this.logger.warn(
        `[Redis SET Failed] Key: ${key}. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  async safeDel(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      this.logger.warn(
        `[Redis DEL Failed] Key: ${key}. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }
}
