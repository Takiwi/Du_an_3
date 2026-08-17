import { Inject, Injectable } from '@nestjs/common';
import { ok, Result } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
  ) {}
  async execute(token: string): Promise<Result<void, AppError>> {
    // hash token
    const hashedToken = this.cryptoService.hash(token);

    // delete refresh token
    await this.refreshTokenRepository.deleteByToken(hashedToken);

    // add access token to blacklist

    return ok();
  }
}
