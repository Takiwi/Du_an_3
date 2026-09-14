import { Prisma, PrismaClient } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface PrismaContext {
  tx: Prisma.TransactionClient | PrismaClient;
}

@Injectable()
export class PrismaTransaction {
  private readonly prismaTransactionStorage =
    new AsyncLocalStorage<PrismaContext>();

  run<T>(store: PrismaContext, callback: () => Promise<T>): Promise<T> {
    return this.prismaTransactionStorage.run(store, callback);
  }

  getCurrentTransaction(): PrismaContext | undefined {
    return this.prismaTransactionStorage.getStore();
  }

  getPrismaClient(
    prisma: PrismaClient,
  ): PrismaClient | Prisma.TransactionClient {
    return this.getCurrentTransaction()?.tx ?? prisma;
  }
}
