import { Inject, Injectable } from '@nestjs/common';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { err, ok, Result } from 'neverthrow';
import { User } from '@auth/domain/entities/user/user.entity';
import { AppError } from '@packages/pattern';
import { Password } from '@auth/domain/value-objects/password.vo';
import { MeUseCase } from '../useCases/me/me.usecase';

@Injectable()
export class UpdatePasswordUserCase {
  constructor(
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly meUseCase: MeUseCase,
  ) {}
  async execute(
    userId: string,
    newPasswordPlain: string,
  ): Promise<Result<User, AppError>> {
    // does the user exists?
    const user = await this.meUseCase.execute(userId);

    if (user.isErr()) return err(user.error);

    // validate password
    const plainPassword = Password.create(newPasswordPlain);

    if (plainPassword.isErr()) return err(plainPassword.error);

    // hash password
    const hashedPassword = await this.passwordHasher.hash(
      plainPassword.value.toString(),
    );

    const isSame = await this.passwordHasher.compare(
      user.value.getPassword().toString(),
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
      user.value.getId(),
      Password.reconstitute(hashedPassword),
    );

    return ok(result);
  }
}
