import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';
import { LoginInput, LoginOutput } from '../contracts/login.contract';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import {
  fail,
  ok,
  Result,
  unwrapResult,
} from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import { ApplicationErrorCode } from '../errors/application.error';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../ports/IJwtAuthentication.port';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@auth/domain/entities/refreshToken.entity';
import { UserId } from '@auth/domain/value-objects/userId.vo';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtAuth: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: LoginInput): Promise<Result<LoginOutput, AppError>> {
    const user = await this.userRepository.findUserByEmail(dto.email);

    if (!user) {
      return fail(
        new AppError(
          ApplicationErrorCode.EMAIL_NOT_FOUND,
          `Not found ${dto.email}`,
        ),
      );
    }
    const isMatch = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!isMatch) {
      return fail(
        new AppError(
          ApplicationErrorCode.PASSWORD_DO_NOT_MATCH,
          `Password do not match.`,
        ),
      );
    }

    // generate tokens
    const { accessToken, refreshToken } = await this.jwtAuth.generateTokenPair({
      sub: user.id,
      email: user.email,
    });

    // save refresh token
    const newRefreshToken = RefreshToken.create({
      userId: unwrapResult(UserId.create(user.id)),
      token: refreshToken,
      tokensUsed: [],
    });

    await this.refreshTokenRepository.insertRefreshToken(newRefreshToken);

    return ok({ user, accessToken, refreshToken });
  }
}
