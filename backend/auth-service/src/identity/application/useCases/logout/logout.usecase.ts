import { Inject, Injectable } from '@nestjs/common';
import { ok, Result, AppError } from '@packages/pattern';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';
import { RedisService } from '@shared/infrastructure/database/redis.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
    private readonly redis: RedisService,
  ) {}
  async execute(token: string): Promise<Result<void, AppError>> {
    // hash token
    const hashedToken = this.cryptoService.hash(token);

    // delete refresh token
    const result = await this.refreshTokenRepository.deleteByToken(hashedToken);

    // add access token to blacklist
    const key = `blacklist-access-token:${result.getUserId().toString()}`;
    await this.redis.set(key, token);

    return ok();
  }
}
