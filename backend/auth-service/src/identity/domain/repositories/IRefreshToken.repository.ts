import { RefreshToken } from '../entities/refreshToken/refreshToken.entity';
import { UserId } from '../value-objects/userId.vo';

export const RT_REPOSITORY_TOKEN = 'IRefreshTokenRepository';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  findById(userId: UserId): Promise<RefreshToken | null>;

  deleteByToken(token: string): Promise<void>;
  deleteById(userId: UserId): Promise<void>;
  revokeAllForUser(userId: UserId): Promise<void>;

  insertRefreshToken(token: RefreshToken): Promise<void>;

  updateTokenAndTokensUsedByToken(
    oldToken: string,
    newToken: string,
  ): Promise<void>;
}
