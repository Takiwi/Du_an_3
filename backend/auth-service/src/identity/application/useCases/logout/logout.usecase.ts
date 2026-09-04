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
import { JWT_AUTHENTICATION_TOKEN } from '@auth/application/ports/IJwtAuthentication.port';
import { JwtAuthentication } from 'src/identity/infrastructure/services/jwt.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
    @Inject(BLACKLIST_TOKEN)
    private readonly blacklist: IBlacklist,
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtAuthentication: JwtAuthentication,
  ) {}
  async execute(
    accessToken: string,
    refreshToken: string,
  ): Promise<Result<void, AppError>> {
    // hash token
    const hashedToken = this.cryptoService.hash(refreshToken);

    // delete refresh token
    await this.refreshTokenRepository.deleteByToken(hashedToken);

    const { exp, jti } = this.jwtAuthentication.getExpAndJti(accessToken);

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const ttlInSeconds = exp - nowInSeconds;

    // add access token to blacklist
    await this.blacklist.insertToken(jti, accessToken, ttlInSeconds);
    return ok();
  }
}
