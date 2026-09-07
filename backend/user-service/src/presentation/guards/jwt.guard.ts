import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { RequestWithCookies } from '../types/requestCookie.type';

const JWKS = createRemoteJWKSet(
  new URL('https://auth.yourdomain.com/.well-known/jwks.json'),
);

export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      // Xác thực token stateless
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: process.env.JWT_ISSUER,
        audience: 'user-service',
      });

      // Gắn thông tin user vào request object để Controller sử dụng
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromRequest(
    request: RequestWithCookies,
  ): string | undefined {
    // 1. Ưu tiên lấy từ Cookie
    if (request.cookies && request.cookies['access_token']) {
      return request.cookies['access_token'];
    }
  }
}
