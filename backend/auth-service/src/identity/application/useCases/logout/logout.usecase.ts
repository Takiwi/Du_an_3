import { Inject, Injectable } from '@nestjs/common';
import { ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';
import {
  BLACKLIST_TOKEN,
  IBlacklist,
} from '@auth/application/ports/IBlackList.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
    @Inject(BLACKLIST_TOKEN)
    private readonly blacklist: IBlacklist,
  ) {}
  async execute(
    accessToken: string,
    refreshToken: string,
  ): Promise<Result<void, AppError>> {
    // hash token
    const hashedToken = this.cryptoService.hash(refreshToken);

    // delete refresh token
    const result = await this.refreshTokenRepository.deleteByToken(hashedToken);

    // add access token to blacklist
    await this.blacklist.insertToken(result.getUserId(), accessToken);
    return ok();
  }
}
