import {
  ACCOUNT_REPOSITORY_TOKEN,
  IAccountRepository,
} from '@domain/repositories/IAccount.repository';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class DeleteAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(accountId: string): Promise<Result<void, AppError>> {
    const id = AccountId.create(accountId);

    if (id.isErr()) return err(id.error);

    const account = await this.accountRepository.deleteAccount(id.value);

    if (account.isErr()) return account;

    return ok();
  }
}
