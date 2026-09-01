import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import { LoginInput, LoginOutput } from './login.contract';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { AppError } from '@packages/pattern';
import { ApplicationErrorCode } from '../../errors/application.error';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../../ports/IJwtAuthentication.port';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@auth/domain/entities/refreshToken/refreshToken.entity';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import {
  FAILED_LOGIN_TRACKER_TOKEN,
  IFailedLoginTracker,
} from '@auth/domain/ports/failedLoginTracker.interface';
import { ok, err, Result } from 'neverthrow';

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
    @Inject(FAILED_LOGIN_TRACKER_TOKEN)
    private readonly failedLoginTracker: IFailedLoginTracker,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {}

  async execute(dto: LoginInput): Promise<Result<LoginOutput, AppError>> {
    // check email
    const user = await this.userRepository.findUserByEmail(dto.email);

    if (!user) {
      return err(
        new AppError(
          ApplicationErrorCode.EMAIL_NOT_FOUND,
          `Not found ${dto.email}`,
        ),
      );
    }

    // check account status
    if (user.getStatus().isBanned()) {
      return err(
        new AppError(
          ApplicationErrorCode.USER_BANNED,
          'The account has been banned',
        ),
      );
    }

    // check password
    const isMatch = await this.passwordHasher.compare(
      dto.password,
      user.getPassword().toString(),
    );

    if (!isMatch) {
      // increase failedLoginCounter and set key-value in redis
      const attempts = await this.failedLoginTracker.incrementAndGet(
        user.getId(),
      );

      // check the number of failed login attempts
      const newStatus = user.getStatus().recordFailedLogin(attempts);

      // check whether the account status is banned
      if (!user.getStatus().equals(newStatus)) {
        user.updateStatus(newStatus);

        await this.userRepository.updateStatusById(user.getId(), newStatus);

        return err(
          new AppError(
            ApplicationErrorCode.TOO_MANY_ATTEMPTS,
            'More than 5 unsuccessful login attempts',
          ),
        );
      }

      return err(
        new AppError(
          ApplicationErrorCode.PASSWORD_DO_NOT_MATCH,
          `Password do not match.`,
        ),
      );
    }

    // generate tokens
    const { accessToken, refreshToken } = await this.jwtAuth.generateTokenPair({
      sub: user.getId().toString(),
      email: user.getEmail(),
    });

    // save refresh token
    const newRefreshToken = RefreshToken.baseEntity({
      userId: user.getId().toString(),
      token: refreshToken,
      expiresAt: this.jwtAuth.getTokenExpiresIn('refresh'),
    });

    if (newRefreshToken.isErr()) {
      return err(newRefreshToken.error);
    }

    await this.refreshTokenRepository.insertRefreshToken(newRefreshToken.value);

    return ok({ user, accessToken, refreshToken });
  }
}
