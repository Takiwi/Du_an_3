import { RefreshToken } from '../entities/refreshToken/refreshToken.entity';
import { AccountId } from '../value-objects/accountId.vo';

export const RT_REPOSITORY_TOKEN = 'IRefreshTokenRepository';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  insertRefreshToken(refreshToken: RefreshToken): Promise<void>;
  updateTokenAndTokensUsedByToken(
    oldToken: string,
    newToken: string,
  ): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  revokeAllForUser(accountId: AccountId): Promise<void>;
}
