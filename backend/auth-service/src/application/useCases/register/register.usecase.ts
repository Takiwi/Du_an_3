import { Inject, Injectable } from '@nestjs/common';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import { RegisterInput, RegisterOutput } from './register.contract';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import { Account } from '@domain/entities/account/account.entity';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import {
  IUserFacade,
  USER_FACADE_TOKEN,
} from '@application/ports/IUserFacade.port';
import {
  IUnitOfWork,
  TRANSACTION_ROLLBACK_ERROR,
} from '@application/ports/IUnitOfWork.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(USER_FACADE_TOKEN)
    private readonly userFacade: IUserFacade,
    @Inject(TRANSACTION_ROLLBACK_ERROR)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(dto: RegisterInput): Promise<Result<RegisterOutput, AppError>> {
    // 1. Send a request to user service to validate the username format and blacklist via User domain
    const userProfile = await this.userFacade.createUserProfile(
      dto.username,
      dto.email,
    );

    // 2. Create Account entity
    const accountResult = Account.baseEntity({
      id: userProfile.id,
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
      await this.accountRepository.insertAccount(account);

      return ok();
    });

    if (result.isErr()) {
      // rollback all
      await this.userFacade.deleteUserProfile(userProfile.id);

      return err(result.error);
    }

    return ok({
      account: account,
      username: dto.username,
      role: ['USER'],
    });
  }
}
