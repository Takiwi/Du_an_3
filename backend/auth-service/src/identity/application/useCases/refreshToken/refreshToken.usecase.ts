import { fail, ok, Result } from '@packages/core/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
  TokenPair,
} from '../../ports/IJwtAuthentication.port';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';

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

  async execute(token: string): Promise<Result<TokenPair, AppError>> {
    // is expired
    const payload = await this.jwtService.verifyToken(token);

    // hash token
    const hashedToken = this.cryptService.hash(token);

    // has session
    const hasRefreshToken =
      await this.refreshTokenRepository.findByToken(hashedToken);

    if (hasRefreshToken) {
      // get user
      const user = await this.userRepository.findUserById(
        hasRefreshToken.getUserId(),
      );

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

      // update old refresh token
      await this.refreshTokenRepository.updateTokenAndTokensUsedByToken(
        hashedNewRefreshToken,
        hashedToken,
      );

      return ok({ accessToken, refreshToken });
    }

    // is token used?
    const isMatch = await this.refreshTokenRepository.isTokenInTokensUsed(
      payload.sub,
      hashedToken,
    );

    if (isMatch) {
      // delete all session
      await this.refreshTokenRepository.deleteManyByUserId(payload.sub);

      return fail(
        new AppError(
          'TOKEN_USED',
          `Token(${hashedToken}) for userId(${payload.sub}) has already been used`,
        ),
      );
    }

    return fail(
      new AppError('TOKEN_NOT_FOUND', `Token(${hashedToken}) is not found`),
    );
  }
}
