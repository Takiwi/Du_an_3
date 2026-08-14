import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../../application/ports/IJwtAuthentication.port';
import { MeUseCase } from '../../application/useCases/me.usecase';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';

export interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
    sessionId?: string;
    [key: string]: string | undefined;
  };
}

export type AuthenticatedUser = {
  userId: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly meUseCase: MeUseCase,
  ) {
    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        return req.cookies?.accessToken ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_PUBLIC_KEY') || '',
      // passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = unwrapResult(await this.meUseCase.execute(payload.sub));

    return { userId: user.id, email: user.email };
  }
}
