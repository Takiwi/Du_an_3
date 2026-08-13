import { RefreshToken } from '../entities/refreshToken.entity';

export const RT_REPOSITORY_TOKEN = 'IRefreshTokenRepository';

export interface IRefreshTokenRepository {
  insertRefreshToken(token: RefreshToken): Promise<void>;
}
