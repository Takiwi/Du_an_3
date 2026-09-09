import { AppError } from '@packages/pattern';
import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '@domain/repositories/IRefreshToken.repository';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../../ports/IJwtAuthentication.port';
import { DATA_HASHER_TOKEN, IDataHasher } from '../../ports/IDataHasher.port';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { RotateTokenOutput } from './refreshToken.contract';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(token: string): Promise<Result<RotateTokenOutput, AppError>> {
    // 1. Verify token
    const payload = await this.jwtService.verifyToken(token);

    // 2. Hash token
    const hashedToken = this.cryptoService.hash(token);

    // 3. Find refresh token session in repository
    const hasRefreshToken =
      await this.refreshTokenRepository.findByToken(hashedToken);

    if (!hasRefreshToken) {
      return err(new AppError('INVALID_TOKEN', 'Not found token'));
    }

    // 4. Validate account in Auth repository
    const accountId = AccountId.reconstitute(payload.sub);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return err(new AppError('USER_NOT_FOUND', 'Account not found'));
    }

    if (account.getStatus().isLocked()) {
      return err(new AppError('USER_BANNED', 'The account has been banned'));
    }

    // 5. Detect token reuse
    const reuseCheck = hasRefreshToken.isReuse(hashedToken);
    if (reuseCheck.isErr()) {
      await this.refreshTokenRepository.revokeAllForUser(
        hasRefreshToken.getAccountId(),
      );
      return err(reuseCheck.error);
    }

    // 6. Generate new token pair
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        sub: account.getId().toString(),
        email: account.getEmail(),
        role: account.getRole().map((role) => role.toString()),
      });

    // 7. Update old refresh token record
    const hashedNewRefreshToken = this.cryptoService.hash(refreshToken);
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
