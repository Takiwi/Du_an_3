import { IUnitOfWork } from '@application/ports/IUnitOfWork.port';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from './prisma-transaction-context.service';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(
    private prisma: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    const existingTransaction = this.prismaTransaction.getCurrentTransaction();

    if (existingTransaction) {
      return await work();
    }

    return await this.prisma.$transaction(async (tx) => {
      return this.prismaTransaction.run({ tx }, work);
    });
  }
}
