import { IBlacklist } from '@application/ports/IBlackList.port';
import { RedisService } from '@infrastructure/database/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistTokenRepository implements IBlacklist {
  constructor(private readonly redis: RedisService) {}

  async insertToken(
    tokenId: string,
    accessToken: string,
    ttlInSeconds: number,
  ): Promise<void> {
    const key = `blacklist-access-token:${tokenId}`;

    await this.redis.set(key, accessToken, 'EX', ttlInSeconds);
  }
}
