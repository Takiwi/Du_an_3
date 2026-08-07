import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCase } from '../../application/useCases/login.usecase';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = unwrapResult(
      await this.loginUseCase.execute({ email, password }),
    );

    return user;
  }
}
