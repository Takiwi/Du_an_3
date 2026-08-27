import { Inject, Injectable } from '@nestjs/common';
import { ApplicationErrorCode } from '../../errors/application.error';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { RegisterInput } from './register.contract';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../../ports/IPasswordHasher.port';
import { User } from '@auth/domain/entities/user.entity';
import { Result, ok, fail } from '@packages/core/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterInput): Promise<Result<User, AppError>> {
    // Check email
    const isEmailTaken = await this.userRepository.existsByEmail(dto.email);

    if (isEmailTaken)
      return fail(
        new AppError(
          ApplicationErrorCode.EMAIL_ALREADY_EXISTS,
          `Email ${dto.email} already exists`,
        ),
      );

    // hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // insert user
    const user = User.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });

    await this.userRepository.insertUser(user);

    return ok(user);
  }
}
