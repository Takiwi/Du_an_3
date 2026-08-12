import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../application/ports/IJwtAuthentication.port';
import { AppError } from '@packages/core/errors/app.error';
import { ClsService } from '@packages/core/cls/cls.service';

interface RequestWithCookies extends Request {
  cookies: { accessToken?: string; [key: string]: string | undefined };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const token = request.cookies?.accessToken;

    if (!token) throw new AppError('UNAUTHORIZED', 'No access token provided');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      this.clsService.set('userId', payload.sub);
      return true;
    } catch {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired token');
    }
  }
}
