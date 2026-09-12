import {
  IUserFacade,
  USER_FACADE_TOKEN,
} from '@application/ports/IUserFacade.port';
import { DeleteAccountUseCase } from '@application/useCases/deleteAccount/deleteAccount.usecase';
import { RegisterUseCase } from '@application/useCases/register/register.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountInput, CreateAccountOutput } from './account.contract';
import { err, ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

@Injectable()
export class CreateAccountSaga {
  constructor(
    @Inject(USER_FACADE_TOKEN)
    private readonly userFacade: IUserFacade,
    private readonly registerUserUseCase: RegisterUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) {}

  async execute(
    dto: CreateAccountInput,
  ): Promise<Result<CreateAccountOutput, AppError>> {
    const compensations: Array<() => Promise<unknown>> = [];

    const profile = await this.userFacade.createUserProfile(
      dto.username,
      dto.email,
    );

    if (profile.isErr()) {
      return err(profile.error);
    }

    compensations.push(() =>
      this.userFacade.deleteUserProfile(profile.value.id),
    );

    const user = await this.registerUserUseCase.execute({
      profileId: profile.value.id,
      email: dto.email,
      password: dto.password,
    });

    if (user.isErr()) {
      await this.compensate(compensations);
      return err(user.error);
    }

    compensations.push(() =>
      this.deleteAccountUseCase.execute(user.value.account.getId().toString()),
    );

    return ok({
      id: profile.value.id,
      email: dto.email,
      username: dto.username,
      role: user.value.role,
      status: profile.value.status,
    });
  }

  private async compensate(compensations: Array<() => Promise<unknown>>) {
    for (const compensate of [...compensations].reverse()) {
      await compensate();
    }
  }
}
