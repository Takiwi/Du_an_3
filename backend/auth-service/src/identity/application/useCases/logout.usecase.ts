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
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../ports/IJwtAuthentication.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
  ) {}
  async execute(token: string): Promise<Result<void, AppError>> {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken)
      return fail(new AppError('TOKEN_NOT_FOUND', 'Token is missing'));

    // verify expiresIn
    await this.jwtService.verifyToken(refreshToken.token);

    // delete refresh token
    await this.refreshTokenRepository.deleteById(token);

    // add access token to blacklist

    return ok();
  }
}
