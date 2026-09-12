import { Inject, Injectable } from '@nestjs/common';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import { Account } from '@domain/entities/account/account.entity';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import {
  IUnitOfWork,
  TRANSACTION_ROLLBACK_ERROR,
} from '@application/ports/IUnitOfWork.port';
import {
  RegisterInputUseCase,
  RegisterOutputUseCase,
} from './register.contract';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TRANSACTION_ROLLBACK_ERROR)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    dto: RegisterInputUseCase,
  ): Promise<Result<RegisterOutputUseCase, AppError>> {
    // 2. Create Account entity
    const accountResult = Account.baseEntity({
      id: dto.profileId,
      email: dto.email,
      password: dto.password,
    });

    if (accountResult.isErr()) {
      return err(accountResult.error);
    }

    const account = accountResult.value;

    // 3. Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // 4. update password
    account.updatePassword(hashedPassword);

    const result = await this.unitOfWork.runInTransaction(async () => {
      // 5. Insert account
      return await this.accountRepository.insertAccount(account);
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok({
      account: account,
      role: ['USER'],
    });
  }
}
