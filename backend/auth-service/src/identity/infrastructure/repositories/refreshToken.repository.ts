import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { IRefreshTokenRepository } from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@auth/domain/entities/refreshToken.entity';
import { UserId } from '@auth/domain/value-objects/userId.vo';
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

  async updateTokenAndTokensUsedByToken(
    oldToken: string,
    newToken: string,
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

  async deleteById(userId: UserId): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: {
        id: userId.toString(),
      },
    });
  }

  async findById(userId: UserId): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        id: userId.toString(),
      },
    });

    return result ? RefreshToken.fromPrismaEntity(result) : null;
  }

  async deleteByToken(token: string): Promise<RefreshToken> {
    const result = await this.prismaService.refreshToken.delete({
      where: { token },
    });

    return RefreshToken.fromPrismaEntity(result);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
    });

    return result ? RefreshToken.fromPrismaEntity(result) : null;
  }

  async revokeAllForUser(userId: UserId): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId: userId.toString(),
      },
    });
  }

  async insertRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.prismaService.refreshToken.create({
      data: {
        id: refreshToken.getId().toString(),
        userId: refreshToken.getUserId().toString(),
        token: this.cryptoService.hash(refreshToken.getToken()),
        tokensUsed: refreshToken.getTokensUsed().toArray(),
        expiresAt: refreshToken.getExpiresAt(),
      },
    });
  }
}
