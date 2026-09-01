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
import { User } from '@auth/domain/entities/user/user.entity';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
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
      return err(
        new AppError(
          ApplicationErrorCode.EMAIL_ALREADY_EXISTS,
          `Email ${dto.email} already exists`,
        ),
      );

    // hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // insert user
    const user = User.baseEntity({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    await this.userRepository.insertUser(user.value);

    return ok(user.value);
  }
}
