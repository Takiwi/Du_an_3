import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppError } from '@packages/pattern';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@presentation/decorators/public.decorator';

export interface BaseJwtPayload {
  sub: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = BaseJwtPayload>(
    err: any,
    user: TUser,
    info: any,
  ): TUser {
    if (err || !user) {
      const errorMessage = info?.message || info || 'No token provided';
      throw new AppError('VALIDATION_TOKEN_FALSE', `${errorMessage}`);
    }

    return user;
  }
}
