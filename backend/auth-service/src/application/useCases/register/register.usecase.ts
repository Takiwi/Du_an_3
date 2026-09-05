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
import { IUserFacade, USER_FACADE_TOKEN } from '../../ports/IUserFacade.port';
import { Account } from '@domain/entities/account/account.entity';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';

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
    private readonly userFacade: IUserFacade,
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

    // 2. Validate username format and blacklist via User domain
    const usernameValidation = this.userFacade.validateUsername(dto.username);
    if (usernameValidation.isErr()) {
      return err(usernameValidation.error);
    }

    // 3. Check username availability
    const isUsernameTaken = await this.userFacade.isUsernameTaken(dto.username);
    if (isUsernameTaken) {
      return err(
        new AppError(
          'USERNAME_ALREADY_EXISTS',
          `Username ${dto.username} already exists`,
        ),
      );
    }

    // 4. Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // 5. Create Account entity
    const accountResult = Account.baseEntity({
      email: dto.email,
      password: hashedPassword,
    });

    if (accountResult.isErr()) {
      return err(accountResult.error);
    }

    const account = accountResult.value;

    // 6. Insert account
    await this.accountRepository.insertAccount(account, dto.username);

    // 7. Initialize User Profile via UserFacade
    const profileResult = await this.userFacade.createProfile({
      id: account.getId().toString(),
      email: account.getEmail(),
      username: dto.username,
      status: account.getStatus().currentStatus(),
      role: account.getRole(),
    });

    if (profileResult.isErr()) {
      return err(profileResult.error);
    }

    return ok({ account, username: dto.username });
  }
}
