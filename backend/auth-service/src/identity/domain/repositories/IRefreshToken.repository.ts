import { RefreshToken } from '../entities/refreshToken.entity';
import { UserId } from '../value-objects/userId.vo';

export const RT_REPOSITORY_TOKEN = 'IRefreshTokenRepository';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  findById(userId: UserId): Promise<RefreshToken | null>;

  deleteByToken(token: string): Promise<RefreshToken>;
  deleteById(userId: UserId): Promise<void>;
  deleteManyByUserId(userId: UserId): Promise<void>;

  insertRefreshToken(token: RefreshToken): Promise<void>;

  updateTokenAndTokensUsedByToken(
    newToken: string,
    oldToken: string,
  ): Promise<void>;

  isTokenInTokensUsed(
    userId: string,
    token: string,
  ): Promise<RefreshToken | null>;
}
