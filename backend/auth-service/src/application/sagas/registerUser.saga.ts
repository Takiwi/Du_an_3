import { IMessagePublisher } from '@application/ports/IMessagePublisher.port';
import { RegisterInput } from '@application/useCases/register/register.contract';
import { Account } from '@domain/entities/account/account.entity';
import { IAccountRepository } from '@domain/repositories/IAccount.repository';
import { Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, Result } from 'neverthrow';

@Injectable()
export class RegisterUserSaga {
  constructor(
    private readonly accountRepo: IAccountRepository,
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(input: RegisterInput): Promise<Result<Account, AppError>> {
    // Step 1: check username
    const isAvailable = await this.messageRequester.request(input.username);

    if (!isAvailable) return err(isAvailable);
  }
}
