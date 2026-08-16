import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
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

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(token: string): Promise<Result<TokenPair, AppError>> {
    const hasRefreshToken = await this.refreshTokenRepository.findById(token);

    if (!hasRefreshToken)
      return fail(new AppError('TOKEN_NOT_FOUND', 'Token is missing'));

    // verify expiresIn
    await this.jwtService.verifyToken(hasRefreshToken.token);

    // is token used?
    if (hasRefreshToken.tokensUsed.includes(hasRefreshToken.token)) {
      return fail(
        new AppError(
          'TOKEN_USED',
          `Token for user ${hasRefreshToken.userId.toString()} has already been used`,
        ),
      );
    }

    // get user
    const user = await this.userRepository.findUserById(
      hasRefreshToken.userId.toString(),
    );

    if (!user)
      return fail(
        new AppError(
          'USER_NOT_FOUND',
          `User ${hasRefreshToken.userId.toString()} not found`,
        ),
      );

    // generate new token pair
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        sub: user.id,
        email: user.email,
      });

    // update old refresh token
    await this.refreshTokenRepository.updateTokenAndTokensUsedByToken(
      refreshToken,
      token,
    );

    return ok({ accessToken, refreshToken });
  }
}
