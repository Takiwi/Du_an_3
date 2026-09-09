import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import { AccountId } from '@domain/value-objects/accountId.vo';
import { Password } from '@domain/value-objects/password.vo';
import { Account } from '@domain/entities/account/account.entity';
import { err, ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(
    accountId: string,
    newPasswordPlain: string,
  ): Promise<Result<Account, AppError>> {
    // check account
    const id = AccountId.reconstitute(accountId);

    const account = await this.accountRepository.findById(id);

    if (!account) {
      return err(
        new AppError(
          'USER_NOT_FOUND',
          `Account with Id ${accountId} not found`,
        ),
      );
    }

    // check password format
    const plainPassword = Password.create(newPasswordPlain);
    if (plainPassword.isErr()) return err(plainPassword.error);

    const hashedPassword = await this.passwordHasher.hash(
      plainPassword.value.toString(),
    );

    // is new password same with new password
    const isSame = await this.passwordHasher.compare(
      plainPassword.value.toString(),
      account.getPassword().toString(),
    );

    if (isSame) {
      return err(
        new AppError(
          'SAME_CURRENT_PASSWORD',
          'New password must differ from current password',
        ),
      );
    }

    await this.accountRepository.updatePasswordById(
      account.getId(),
      Password.reconstitute(hashedPassword),
    );

    account.updatePassword(hashedPassword);

    return ok(account);
  }
}
