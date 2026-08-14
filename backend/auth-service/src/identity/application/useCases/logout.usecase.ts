import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUser.repository';
import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '../../domain/repositories/IRefreshToken.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}
  async execute(refreshToken: string): Promise<Result<void, AppError>> {
    // delete refresh token
    const token = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!token)
      return fail(new AppError('TOKEN_NOT_FOUND', 'Refresh token not found'));

    await this.refreshTokenRepository.deleteByToken(refreshToken);

    return ok();
  }
}
