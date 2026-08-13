import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '../../../domain/entities/refreshToken.entity';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insertRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.prismaService.refreshToken.create({
      data: {
        id: refreshToken.id,
        userId: refreshToken.userId.toString(),
        token: crypto
          .createHash('sha256')
          .update(refreshToken.token)
          .digest('hex'),
        tokensUsed: refreshToken.tokensUsed,
      },
    });
  }
}
