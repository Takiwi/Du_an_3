import { IFailedLoginTracker } from '@auth/domain/ports/failedLoginTracker.interface';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@shared/infrastructure/database/redis.service';

@Injectable()
export class RedisFailedLoginTracker implements IFailedLoginTracker {
  constructor(private readonly redis: RedisService) {}

  async incrementAndGet(userId: UserId): Promise<number> {
    const key = `failed_login:${userId.toString()}`;

    const pipeline = this.redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, 300); // 5 minutes

    const results = await pipeline.exec();
    const firstResult = results?.[0];

    if (!results || !firstResult || firstResult[0]) {
      throw firstResult?.[0] || new Error('Pipeline execution failed');
    }

    return firstResult[1] as number;
  }

  // async reset(userId: UserId): Promise<void> {
  //   const key = `failed_login:${userId.toString()}`;

  //   await this.redis.del(key);
  // }
}
