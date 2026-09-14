import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppError } from '@packages/pattern';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';

type AuthenticatedUser = Express.User & JWTPayload;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const JWKS = createRemoteJWKSet(
      new URL(this.configService.getOrThrow('jwks.url')),
    );

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new AppError(
        'VALIDATION_TOKEN_FALSE',
        'Missing authentication token',
      );
    }

    try {
      // Xác thực token stateless
      const { payload } = await jwtVerify<AuthenticatedUser>(token, JWKS, {
        issuer: this.configService.getOrThrow('jwt.jwtIssuer'),
        audience: 'user-service',
      });

      // Gắn thông tin user vào request object để Controller sử dụng
      request['user'] = payload;
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[Auth guard error]', err);

      throw new AppError('INVALID_TOKEN', 'Invalid or expired token');
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    if (request.cookies && request.cookies['accessToken']) {
      return request.cookies['accessToken'];
    }
  }
}
