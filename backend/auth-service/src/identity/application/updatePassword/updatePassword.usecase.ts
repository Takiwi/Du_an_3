import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { err, ok, Result } from 'neverthrow';
import { User } from '@auth/domain/entities/user/user.entity';
import { AppError } from '@packages/pattern';
import { Password } from '@auth/domain/value-objects/password.vo';

@Injectable()
export class UpdatePasswordUserCase {
  constructor(
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    userId: string,
    newPasswordPlain: string,
  ): Promise<Result<User, AppError>> {
    // does the user exists?
    const id = UserId.reconstitute(userId);
    const user = await this.userRepository.findUserById(id);

    if (!user)
      return err(
        new AppError('USER_NOT_FOUND', `User with ID ${userId} not found`),
      );

    // validate password
    const plainPassword = Password.create(newPasswordPlain);

    if (plainPassword.isErr()) return err(plainPassword.error);

    // hash password
    const hashedPassword = await this.passwordHasher.hash(
      plainPassword.value.toString(),
    );

    const isSame = await this.passwordHasher.compare(
      user.getPassword().toString(),
      hashedPassword,
    );

    // is new the password the same as the old password?
    if (isSame)
      return err(
        new AppError(
          'SAME_CURRENT_PASSWORD',
          'New password must differ from current password',
        ),
      );

    const result = await this.userRepository.updatePasswordById(
      id,
      Password.reconstitute(hashedPassword),
    );

    return ok(result);
  }
}
