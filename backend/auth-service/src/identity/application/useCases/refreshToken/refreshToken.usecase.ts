import { AppError } from '@packages/pattern';
import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../../ports/IJwtAuthentication.port';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';
import { RotateTokenOutput } from './refreshToken.contract';
import { err, ok, Result } from 'neverthrow';
import { MeUseCase } from '../me/me.usecase';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptService: IDataHasher,
    private readonly meUseCase: MeUseCase,
  ) {}

  async execute(token: string): Promise<Result<RotateTokenOutput, AppError>> {
    // is expired
    const payload = await this.jwtService.verifyToken(token);

    // hash token
    const hashedToken = this.cryptService.hash(token);

    // has session
    const hasRefreshToken =
      await this.refreshTokenRepository.findByToken(hashedToken);

    if (!hasRefreshToken)
      return err(new AppError('INVALID_TOKEN', 'Not found token'));

    // get user
    const user = await this.meUseCase.execute(payload.sub);

    if (user.isErr()) {
      return err(user.error);
    }

    // is token used?
    const result = hasRefreshToken.isReuse(hashedToken);

    if (result.isErr()) {
      // revoke all session
      await this.refreshTokenRepository.revokeAllForUser(
        hasRefreshToken.getUserId(),
      );

      return err(result.error);
    }

    // generate new token pair
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        sub: user.value.getId().toString(),
        email: user.value.getEmail(),
      });

    // hash new refresh token
    const hashedNewRefreshToken = this.cryptService.hash(refreshToken);

    // update old refresh token
    await this.refreshTokenRepository.updateTokenAndTokensUsedByToken(
      hashedToken,
      hashedNewRefreshToken,
    );

    return ok({
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: hasRefreshToken.getExpiresAt(),
    });
  }
}
