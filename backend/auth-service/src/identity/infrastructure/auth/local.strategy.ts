import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCase } from '../../application/useCases/login.usecase';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';
import { LoginOutput } from '../../application/contracts/login.contract';

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
