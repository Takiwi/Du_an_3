import { Inject, Injectable } from '@nestjs/common';
import { ApplicationErrorCode } from '../errors/application.error';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUser.repository';
import { CreateUserInput } from '../contracts/createUser.contract';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';
import { User } from '../../domain/entities/user.entity';
import { Result, ok, fail } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: CreateUserInput): Promise<Result<User, AppError>> {
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
      username: hashedPassword,
      password: dto.password,
    });

    const newUser = await this.userRepository.insertUser(user);

    return ok(newUser);
  }
}
