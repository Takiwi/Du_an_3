import { IUnitOfWork } from '@application/ports/IUnitOfWork.port';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from './prisma-transaction-context.service';
import { Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(
    private prisma: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async runInTransaction<T>(
    work: () => Promise<Result<T, AppError>>,
  ): Promise<Result<T, AppError>> {
    const existingTransaction = this.prismaTransaction.getCurrentTransaction();

    if (existingTransaction) {
      const result = await work();

      if (result.isErr()) return result;

      return result;
    }

    return await this.prisma.$transaction(async (tx) => {
      const result = await this.prismaTransaction.run({ tx }, work);

      if (result.isErr()) return result;
      return result;
    });
  }
}
