import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCase } from '@auth/application/useCases/login/login.usecase';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';
import { LoginOutput } from '@auth/application/useCases/login/login.contract';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<LoginOutput> {
    const result = unwrapResult(
      await this.loginUseCase.execute({ email, password }),
    );

    return result;
  }
}
