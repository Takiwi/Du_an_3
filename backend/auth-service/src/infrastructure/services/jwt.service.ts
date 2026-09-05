import { JwtService } from '@nestjs/jwt';
import {
  IJwtAuthentication,
  JwtPayload,
  TokenPair,
} from '@application/ports/IJwtAuthentication.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtAuthentication implements IJwtAuthentication {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getExpAndJti(token: string): { exp: number; jti: string } {
    return this.jwtService.decode(token);
  }

  getTokenExpiresIn(type: 'access' | 'refresh'): number {
    if (type === 'access') {
      return this.configService.getOrThrow<number>('jwt.accessTokenExpiresIn');
    }

    return this.configService.getOrThrow<number>('jwt.refreshTokenExpiresIn');
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        algorithm: 'RS256',
        expiresIn: this.getTokenExpiresIn('access'),
        jwtid: randomUUID(),
      }),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          algorithm: 'RS256',
          expiresIn: this.getTokenExpiresIn('refresh'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
