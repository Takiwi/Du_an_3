import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '@auth/application/ports/IJwtAuthentication.port';
import { RequestWithCookies } from '../../presentation/types/requestCookie.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        return req.cookies?.accessToken ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_PUBLIC_KEY') || '',
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithCookies, payload: JwtPayload) {
    const accessToken = req.cookies?.accessToken;

    return { accessToken, sub: payload.sub, email: payload.email };
  }
}
