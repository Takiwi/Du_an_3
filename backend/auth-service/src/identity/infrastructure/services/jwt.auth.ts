import { JwtService } from '@nestjs/jwt';
import {
  IJwtAuthentication,
  JwtPayload,
  TokenPair,
} from '@auth/application/ports/IJwtAuthentication.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthentication implements IJwtAuthentication {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<void> {
    await this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        algorithm: 'RS256',
        expiresIn: '5m',
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
