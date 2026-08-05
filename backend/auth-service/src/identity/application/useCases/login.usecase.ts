import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';
import { LoginInput } from '../contracts/login.contract';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUser.repository';
import {
  NotFoundEmailException,
  PasswordDoNotMatchException,
} from '../errors/application.error';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: LoginInput) {
    const user = await this.userRepository.findUserByEmail(dto.email);

    if (!user) throw new NotFoundEmailException(dto.email);

    const isMatch = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (isMatch) throw new PasswordDoNotMatchException();

    // generate tokens
  }
}
