import { IBlacklist } from '../../application/ports/IBlackList.port';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@shared/database/redis.service';

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
