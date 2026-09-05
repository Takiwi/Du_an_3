import { Injectable } from '@nestjs/common';
import { Account } from '@domain/entities/account/account.entity';
import { IAccountRepository } from '@domain/repositories/IAccount.repository';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { AccountStatus } from '@domain/value-objects/accountStatus.vo';
import { Password } from '@domain/value-objects/password.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerError } from '@infrastructure/helpers/asyncHandlerError.helper';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Account | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return user ? Account.reconstitute(user) : null;
  }

  async findById(id: AccountId): Promise<Account | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id.toString() },
    });

    return user ? Account.reconstitute(user) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  async updateStatusById(
    id: AccountId,
    status: AccountStatus,
  ): Promise<Account> {
    const result = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: { id: id.toString() },
        data: { status: status.currentStatus() },
      });
    });

    return Account.reconstitute(result);
  }

  async updatePasswordById(
    id: AccountId,
    password: Password,
  ): Promise<Account> {
    const result = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: { id: id.toString() },
        data: { password: password.toString() },
      });
    });

    return Account.reconstitute(result);
  }

  async insertAccount(
    account: Account,
    initialUsername?: string,
  ): Promise<void> {
    await asyncHandlerError(async () => {
      await this.prismaService.user.create({
        data: {
          id: account.getId().toString(),
          email: account.getEmail(),
          username:
            initialUsername || `user_${account.getId().toString().slice(0, 8)}`,
          password: account.getPassword().toString(),
          status: account.getStatus().currentStatus(),
          role: account.getRole(),
        },
      });
    });
  }
}
