import { RefreshToken } from '../entities/refreshToken.entity';

export interface IRefreshTokenRepository {
  insertRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken>;
}
