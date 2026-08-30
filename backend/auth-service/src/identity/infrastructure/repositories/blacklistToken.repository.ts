import { IBlacklist } from '@auth/application/ports/IBlackList.port';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@shared/database/redis.service';

@Injectable()
export class BlacklistToken implements IBlacklist {
  constructor(private readonly redis: RedisService) {}

  async insertToken(userId: UserId, accessToken: string): Promise<void> {
    const key = `blacklist-access-token:${userId.toString()}`;

    await this.redis.set(key, accessToken, 'EX', 300);
  }
}
