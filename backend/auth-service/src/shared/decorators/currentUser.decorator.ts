import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { LoginOutput } from '../../identity/application/contracts/login.contract';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LoginOutput | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user as LoginOutput | undefined;
  },
);
