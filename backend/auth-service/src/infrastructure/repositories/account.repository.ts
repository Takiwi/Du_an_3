import { Injectable } from '@nestjs/common';
import { Account } from '@domain/entities/account/account.entity';
import { IAccountRepository } from '@domain/repositories/IAccount.repository';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { AccountStatus } from '@domain/value-objects/accountStatus.vo';
import { Password } from '@domain/value-objects/password.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async deleteAccount(accountId: AccountId): Promise<Result<void, AppError>> {
    const result = await asyncHandlerPrismaError(async () => {
      await this.client.account.delete({
        where: { id: accountId.toString() },
      });
    });

    return result;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const user = await this.prismaService.account.findUnique({
      where: { email },
      include: {
        account_role: true,
      },
    });

    if (!user) return null;

    const roleId = user.account_role.map((role) => role.roleId);

    return Account.reconstitute({ ...user, role: roleId });
  }

  async findById(id: AccountId): Promise<Account | null> {
    const user = await this.prismaService.account.findUnique({
      where: { id: id.toString() },
      include: { account_role: true },
    });

    if (!user) return null;

    const roleId = user.account_role.map((role) => role.roleId);

    return Account.reconstitute({ ...user, role: roleId });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prismaService.account.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  async updateStatusById(
    id: AccountId,
    status: AccountStatus,
  ): Promise<Result<void, AppError>> {
    return await asyncHandlerPrismaError(async () => {
      await this.client.account.update({
        where: { id: id.toString() },
        data: { status: status.currentStatus() },
      });
    });
  }

  async updatePasswordById(
    id: AccountId,
    password: Password,
  ): Promise<Result<void, AppError>> {
    return await asyncHandlerPrismaError(async () => {
      await this.client.account.update({
        where: { id: id.toString() },
        data: { password: password.toString() },
      });
    });
  }

  async insertAccount(account: Account): Promise<Result<void, AppError>> {
    return await asyncHandlerPrismaError(async () => {
      await this.client.account.create({
        data: {
          id: account.getId().toString(),
          email: account.getEmail(),
          password: account.getPassword().toString(),
          status: account.getStatus().currentStatus(),
          account_role: {
            create: account.getRole().map((role) => {
              return { roleId: role.getRoleId() };
            }),
          },
        },
      });
    });
  }

  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prismaService);
  }
}
