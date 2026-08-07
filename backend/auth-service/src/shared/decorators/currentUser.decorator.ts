import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../identity/domain/entities/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user as User | undefined;
  },
);
