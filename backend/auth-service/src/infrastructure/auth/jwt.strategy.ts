import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '@application/ports/IJwtAuthentication.port';
import { AppError } from '@packages/pattern';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { RedisService } from '@infrastructure/database/redis.service';
import { RequestWithCookies } from '@presentation/types/requestCookie.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {
    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        return req.cookies?.accessToken ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.publicKey'),
      passReqToCallback: true,
    });
  }

  async validate(req: RequestWithCookies, payload: JwtPayload) {
    const accessToken = req.cookies?.accessToken;

    const key = `blacklist-access-token:${payload.sub}`;
    const blacklist = await this.redis.get(key);

    if (blacklist) {
      this.logger.warn('Access token has already been used');
      throw new AppError('INVALID_TOKEN', 'Invalid token');
    }

    return {
      accessToken,
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
