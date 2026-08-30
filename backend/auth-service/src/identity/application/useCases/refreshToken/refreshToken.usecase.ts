import { fail, ok, Result, AppError } from '@packages/pattern';
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
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { RotateTokenOutput } from './refreshToken.contract';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptService: IDataHasher,
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
      return fail(new AppError('INVALID_TOKEN', 'Not found token'));

    // get user
    const userId = UserId.create(payload.sub);
    const user = await this.userRepository.findUserById(userId);

    if (!user || hasRefreshToken.getUserId().toString() !== payload.sub)
      return fail(
        new AppError('USER_NOT_FOUND', `User ${payload.sub} not found`),
      );

    // generate new token pair
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        sub: user.getId().toString(),
        email: user.getEmail(),
      });

    // hash new refresh token
    const hashedNewRefreshToken = this.cryptService.hash(refreshToken);

    // is token used?
    const result = hasRefreshToken.route(hashedToken, refreshToken);

    if (!result.success) {
      // revoke all session
      await this.refreshTokenRepository.revokeAllForUser(
        hasRefreshToken.getUserId(),
      );

      return fail(result.error);
    }

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
