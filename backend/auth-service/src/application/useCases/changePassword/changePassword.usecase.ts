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
    userId: string,
    newPasswordPlain: string,
  ): Promise<Result<Account, AppError>> {
    const accountIdResult = AccountId.create(userId);
    if (accountIdResult.isErr()) return err(accountIdResult.error);

    const account = await this.accountRepository.findById(
      accountIdResult.value,
    );
    if (!account) {
      return err(
        new AppError('USER_NOT_FOUND', `Account with Id ${userId} not found`),
      );
    }

    const plainPassword = Password.create(newPasswordPlain);
    if (plainPassword.isErr()) return err(plainPassword.error);

    const hashedPassword = await this.passwordHasher.hash(
      plainPassword.value.toString(),
    );

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

    const updatedAccount = await this.accountRepository.updatePasswordById(
      account.getId(),
      Password.reconstitute(hashedPassword),
    );

    return ok(updatedAccount);
  }
}
