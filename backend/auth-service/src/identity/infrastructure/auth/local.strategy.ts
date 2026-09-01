import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCase } from '@auth/application/useCases/login/login.usecase';
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
    const result = await this.loginUseCase.execute({ email, password });

    if (result.isErr()) throw result.error;

    return result.value;
  }
}
