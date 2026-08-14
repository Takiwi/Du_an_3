import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import { LoginOutput } from '../contracts/login.contract';
import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  RT_REPOSITORY_TOKEN,
} from '../../domain/repositories/IRefreshToken.repository';
import {
  IJwtAuthentication,
  JWT_AUTHENTICATION_TOKEN,
} from '../ports/IJwtAuthentication.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_AUTHENTICATION_TOKEN)
    private readonly jwtService: IJwtAuthentication,
    @Inject(RT_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(sessionId: string): Promise<Result<LoginOutput, AppError>> {
    const refreshToken = await this.refreshTokenRepository.findById(sessionId);

    if (!refreshToken)
      return fail(new AppError('TOKEN_NOT_FOUND', 'Token is missing'));

    // verify expiresIn
    await this.jwtService.verifyToken(refreshToken.token);

    // is token used?
    if (refreshToken.token in refreshToken.tokensUsed) {
      return ok(refreshToken);
    }
  }
}
