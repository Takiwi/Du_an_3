import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import { LoginInput, LoginOutput } from './login.contract';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import { AppError } from '@packages/pattern';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../../ports/IJwtAuthentication.port';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@domain/entities/refreshToken/refreshToken.entity';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import {
  FAILED_LOGIN_TRACKER_TOKEN,
  IFailedLoginTracker,
} from '@domain/ports/failedLoginTracker.interface';
import { ok, err, Result } from 'neverthrow';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@domain/repositories/IRole.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtAuth: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(FAILED_LOGIN_TRACKER_TOKEN)
    private readonly failedLoginTracker: IFailedLoginTracker,
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {}

  async execute(dto: LoginInput): Promise<Result<LoginOutput, AppError>> {
    // check email
    const account = await this.accountRepository.findByEmail(dto.email);

    if (!account) {
      return err(new AppError('EMAIL_NOT_FOUND', `Not found ${dto.email}`));
    }

    // check status
    if (account.getStatus().isLocked()) {
      return err(
        new AppError('ACCOUNT_LOCKED', 'The account has been clocked'),
      );
    }

    // check password
    const isMatch = await this.passwordHasher.compare(
      dto.password,
      account.getPassword().toString(),
    );

    if (!isMatch) {
      // check login count
      const attempts = await this.failedLoginTracker.incrementAndGet(
        account.getId(),
      );

      const newStatus = account.getStatus().recordFailedLogin(attempts);

      // Check if you've exceeded the login limit.
      if (!account.getStatus().equals(newStatus)) {
        account.updateStatus(newStatus);
        await this.accountRepository.updateStatusById(
          account.getId(),
          newStatus,
        );

        return err(
          new AppError(
            'TOO_MANY_ATTEMPTS',
            'More than 5 unsuccessful login attempts',
          ),
        );
      }

      return err(
        new AppError('PASSWORD_DO_NOT_MATCH', 'Password do not match.'),
      );
    }

    // get account role and permission
    const roles = await this.roleRepository.findManyRoleAndPermissionById(
      account.getRole(),
    );

    if (roles.length === 0)
      return err(
        new AppError('ROLE_NOT_FOUND', `Account doesn't have any Role`),
      );

    const accountRoles = roles.map((role) => role.getRoleName());

    const permissions = [
      ...new Set(
        roles.flatMap((role) =>
          role
            .getPermission()
            .map((pr) => `${pr.getResource()}:${pr.getAction()}`),
        ),
      ),
    ];

    // create token pair
    const { accessToken, refreshToken } = await this.jwtAuth.generateTokenPair({
      sub: account.getId().toString(),
      role: accountRoles,
      permission: permissions,
    });

    // save refresh token
    const newRefreshToken = RefreshToken.baseEntity({
      accountId: account.getId(),
      token: refreshToken,
      expiresAt: this.jwtAuth.getTokenExpiresIn('refresh'),
    });

    if (newRefreshToken.isErr()) {
      return err(newRefreshToken.error);
    }

    await this.refreshTokenRepository.insertRefreshToken(newRefreshToken.value);

    return ok({ account, accessToken, refreshToken });
  }
}
