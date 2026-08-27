import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IRefreshTokenRepository } from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@auth/domain/entities/refreshToken.entity';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { unwrapResult } from '@packages/core/helpers/resultPattern';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@auth/application/ports/IDataHasher.port';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
  ) {}

  async isTokenInTokensUsed(userId: string, token: string): Promise<boolean> {
    const result = await this.prismaService.refreshToken.findFirst({
      where: { userId, tokensUsed: { has: token } },
    });

    return result ? true : false;
  }

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
          userId: unwrapResult(UserId.create(result.userId)),
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
          userId: unwrapResult(UserId.create(result.userId)),
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
        id: refreshToken.getId().toString(),
        userId: refreshToken.getUserId().toString(),
        token: this.cryptoService.hash(refreshToken.getToken()),
        tokensUsed: refreshToken.getTokensUsed(),
      },
    });
  }
}
