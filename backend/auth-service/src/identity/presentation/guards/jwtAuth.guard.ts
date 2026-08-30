import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppError } from '@packages/pattern';
import { JwtPayload } from '@auth/application/ports/IJwtAuthentication.port';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/decorators/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // check decorator ở method
      context.getClass(), // check decorator ở cả controller
    ]);

    if (isPublic) {
      return true; // bỏ qua auth check hoàn toàn
    }

    return super.canActivate(context); // chạy logic auth bình thường
  }

  handleRequest<TUser = JwtPayload>(err: any, user: TUser, info: any): TUser {
    if (err || !user) {
      const errorMessage = info?.message || info || 'No token provided';

      throw new AppError(
        'VALIDATION_TOKEN_FALSE',
        `Invalid or expired token, ${errorMessage}`,
      );
    }

    return user;
  }
}
