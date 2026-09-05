import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@domain/entities/refreshToken/refreshToken.entity';
import { AccountId } from '@domain/value-objects/accountId.vo';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@application/ports/IDataHasher.port';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerError } from '@infrastructure/helpers/asyncHandlerError.helper';

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
    await asyncHandlerError(async () => {
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
    });
  }

  async deleteById(id: AccountId): Promise<void> {
    await asyncHandlerError(async () => {
      await this.prismaService.refreshToken.delete({
        where: {
          id: id.toString(),
        },
      });
    });
  }

  async findById(id: AccountId): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return result ? RefreshToken.reconstitute(result) : null;
  }

  async deleteByToken(token: string): Promise<void> {
    await asyncHandlerError(async () => {
      await this.prismaService.refreshToken.delete({
        where: { token },
      });
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
    });

    return result ? RefreshToken.reconstitute(result) : null;
  }

  async revokeAllForUser(userId: AccountId): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId: userId.toString(),
      },
    });
  }

  async insertRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await asyncHandlerError(async () => {
      await this.prismaService.refreshToken.create({
        data: {
          id: refreshToken.getId().toString(),
          userId: refreshToken.getUserId().toString(),
          token: this.cryptoService.hash(refreshToken.getToken()),
          tokensUsed: refreshToken.getTokensUsed().toArray(),
          expiresAt: refreshToken.getExpiresAt(),
        },
      });
    });
  }
}
