import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  <T>(data: T, ctx: ExecutionContext): T | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user as T | undefined;
  },
);
