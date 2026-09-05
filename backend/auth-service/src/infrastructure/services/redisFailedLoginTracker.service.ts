import { IFailedLoginTracker } from '@domain/ports/failedLoginTracker.interface';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { RedisService } from '@infrastructure/database/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisFailedLoginTracker implements IFailedLoginTracker {
  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async incrementAndGet(accountId: AccountId): Promise<number> {
    const key = `failed_login:${accountId.toString()}`;
    const expiredIn = this.configService.getOrThrow<number>(
      'jwt.publicExpiresIn',
    );

    const pipeline = this.redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, expiredIn);

    const results = await pipeline.exec();
    const firstResult = results?.[0];

    if (!results || !firstResult || firstResult[0]) {
      throw firstResult?.[0] || new Error('Pipeline execution failed');
    }

    return firstResult[1] as number;
  }
}
