import { JwtService } from '@nestjs/jwt';
import {
  IJwtAuthentication,
  JwtPayload,
} from '../../application/ports/IJwtAuthentication.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthentication implements IJwtAuthentication {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenPair(payload: JwtPayload): Promise<string[]> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload.sub),
    ]);

    return [accessToken, refreshToken];
  }
}
