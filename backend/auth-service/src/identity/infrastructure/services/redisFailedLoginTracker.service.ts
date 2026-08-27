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

    if (!results || results[0][0]) {
      throw results?.[0][0] || new Error('Pipeline execution failed');
    }

    return results[0][1] as number;
  }

  // async reset(userId: UserId): Promise<void> {
  //   const key = `failed_login:${userId.toString()}`;

  //   await this.redis.del(key);
  // }
}
