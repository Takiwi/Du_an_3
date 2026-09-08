import { Inject, Injectable } from '@nestjs/common';
import {
  IAccountRepository,
  ACCOUNT_REPOSITORY_TOKEN,
} from '@domain/repositories/IAccount.repository';
import { RegisterInput } from './register.contract';
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

export interface RegisterOutput {
  account: Account;
  username: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_TOKEN)
    private readonly accountRepository: IAccountRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(USER_FACADE_TOKEN)
    private userFacade: IUserFacade,
  ) {}

  async execute(dto: RegisterInput): Promise<Result<RegisterOutput, AppError>> {
    // 1. Check email
    const isEmailTaken = await this.accountRepository.existsByEmail(dto.email);

    if (isEmailTaken) {
      return err(
        new AppError(
          'EMAIL_ALREADY_EXISTS',
          `Email ${dto.email} already exists`,
        ),
      );
    }

    // 2. Send a request to user service to validate the username format and blacklist via User domain
    const userProfile = await this.userFacade.createUserProfile(
      dto.username,
      dto.email,
    );

    console.log(`User id in auth service:::::::::${userProfile.id}`);

    // 3. Create Account entity
    const accountResult = Account.baseEntity({
      id: userProfile.id,
      email: dto.email,
      password: dto.password,
    });

    if (accountResult.isErr()) {
      // rollback all
      await this.userFacade.deleteUserProfile(userProfile.id);

      return err(accountResult.error);
    }

    const account = accountResult.value;

    // 4. Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // 5. update password
    account.updatePassword(hashedPassword);

    // 5. Insert account
    await this.accountRepository.insertAccount(account);

    return ok({ account, username: dto.username });
  }
}
