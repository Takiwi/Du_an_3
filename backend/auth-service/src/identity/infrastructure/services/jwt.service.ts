import { JwtService } from '@nestjs/jwt';
import {
  IJwtAuthentication,
  JwtPayload,
  TokenPair,
} from '@auth/application/ports/IJwtAuthentication.port';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthentication implements IJwtAuthentication {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
