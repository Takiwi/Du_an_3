import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '@domain/repositories/IRefreshToken.repository';
import { RefreshToken } from '@domain/entities/refreshToken/refreshToken.entity';
import { AccountId } from '@domain/value-objects/accountId.vo';
import {
  DATA_HASHER_TOKEN,
  IDataHasher,
} from '@application/ports/IDataHasher.port';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(DATA_HASHER_TOKEN)
    private readonly cryptoService: IDataHasher,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async updateTokenAndTokensUsedByToken(
    oldToken: string,
    newToken: string,
  ): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.refreshToken.update({
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

  async deleteByToken(token: string): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.refreshToken.delete({
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

  async revokeAllForUser(accountId: AccountId): Promise<void> {
    await this.client.refreshToken.deleteMany({
      where: {
        accountId: accountId.toString(),
      },
    });
  }

  async insertRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.refreshToken.create({
        data: {
          id: refreshToken.getId().toString(),
          accountId: refreshToken.getAccountId().toString(),
          token: this.cryptoService.hash(refreshToken.getToken()),
          tokensUsed: refreshToken.getTokensUsed().toArray(),
          expiresAt: refreshToken.getExpiresAt(),
        },
      });
    });
  }

  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prismaService);
  }
}
