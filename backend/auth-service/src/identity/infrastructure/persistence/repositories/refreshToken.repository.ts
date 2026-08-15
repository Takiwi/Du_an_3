import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IRefreshTokenRepository } from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@auth/domain/entities/refreshToken.entity';
import * as crypto from 'crypto';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async updateTokenAndTokensUsedByToken(
    newToken: string,
    oldToken: string,
  ): Promise<void> {
    await this.prismaService.refreshToken.update({
      where: {
        token: oldToken,
      },
      data: {
        token: newToken,
        tokensUsed: {
          push: oldToken,
        },
      },
    });
  }
  async deleteById(id: string): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: {
        id,
      },
    });
  }
  async findById(id: string): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        id,
      },
    });

    return result
      ? RefreshToken.fromPrismaEntity({
          ...result,
          userId: unwrapResult(UserId.create(result.id)),
        })
      : null;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: { token },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
    });

    return result
      ? RefreshToken.fromPrismaEntity({
          ...result,
          userId: unwrapResult(UserId.create(result.id)),
        })
      : null;
  }
  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prismaService.refreshToken.findMany({
      where: {
        userId,
      },
    });
  }

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
