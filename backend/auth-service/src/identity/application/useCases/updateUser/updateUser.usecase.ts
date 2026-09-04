import { User } from '@auth/domain/entities/user/user.entity';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { UpdateUserInput } from './updateUser.contract';
import { MeUseCase } from '../me/me.usecase';

@Injectable()
export class UpdateUserUserCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly meUseCase: MeUseCase,
  ) {}
  async execute(input: UpdateUserInput): Promise<Result<User, AppError>> {
    // does the user exists?
    const user = await this.meUseCase.execute(input.id);

    if (user.isErr()) {
      return err(user.error);
    }

    const updates: { username?: string; lastUsernameChangedAt?: Date } = {};

    if (input.username !== undefined) {
      // can change username
      const newUsername = user.value
        .getUsername()
        .changeUsername(input.username, new Date());

      if (newUsername.isErr()) return err(newUsername.error);

      // Has this username already been taken?
      const username = await this.userRepository.findByUsername(
        newUsername.value.toString(),
      );

      if (username)
        return err(
          new AppError(
            'USERNAME_ALREADY_EXISTS',
            `Username ${input.username} already exists`,
          ),
        );

      user.value.updateUsername(newUsername.value);

      updates.username = newUsername.value.toString();
      updates.lastUsernameChangedAt =
        newUsername.value.getLastUsernameChangedAt() ?? undefined;
    }

    if (Object.keys(updates).length > 0) {
      await this.userRepository.updateUsernameById(user.value.getId(), updates);
    }

    return ok(user.value);
  }
}
