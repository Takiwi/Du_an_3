import { RegisterInput } from '@application/useCases/register/register.contract';
import { RegisterUseCase } from '@application/useCases/register/register.usecase';
import { SagaRunner } from '@infrastructure/services/sagaRunner.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateAccountSaga {
  constructor(
    private readonly sagaRunner: SagaRunner,
    private readonly registerUserCase: RegisterUseCase,
  ) {}

  async execute(dto: RegisterInput) {
    return this.sagaRunner.run([this.registerUserCase]);
  }
}
