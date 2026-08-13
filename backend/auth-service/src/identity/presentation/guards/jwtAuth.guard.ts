import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppError } from '@packages/core/errors/app.error';
import { AuthenticatedUser } from '../../infrastructure/auth/jwt.strategy';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthenticatedUser>(
    err: any,
    user: TUser,
    info: any,
  ): TUser {
    if (err || !user) {
      throw new AppError(
        'VALIDATION_TOKEN_FALSE',
        `Invalid or expired token, ${info}`,
      );
    }

    return user;
  }
}
