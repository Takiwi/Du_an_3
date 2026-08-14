import { JwtService } from '@nestjs/jwt';
import {
  IJwtAuthentication,
  JwtPayload,
  TokenPair,
} from '../../application/ports/IJwtAuthentication.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthentication implements IJwtAuthentication {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        algorithm: 'RS256',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          algorithm: 'RS256',
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
