import { RefreshToken } from '../entities/refreshToken.entity';

export const RT_REPOSITORY_TOKEN = 'IRefreshTokenRepository';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;

  deleteByToken(token: string): Promise<void>;
  deleteManyByUserId(userId: string): Promise<void>;

  insertRefreshToken(token: RefreshToken): Promise<void>;
}
