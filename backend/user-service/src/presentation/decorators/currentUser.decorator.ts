import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayload } from 'jose';

export interface UserPayload extends JWTPayload {
  sub: string;
  email?: string;
  roles?: string[];
}

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserPayload }>();
    const user = request.user;

    // Nếu truyền param (vd: @CurrentUser('email')), trả về thuộc tính đó
    return data ? user?.[data] : user;
  },
);
