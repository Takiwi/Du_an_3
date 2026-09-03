import { User } from '@auth/domain/entities/user/user.entity';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { UpdateUserInput } from './updateUser.contract';

@Injectable()
export class UpdateUserUserCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(input: UpdateUserInput): Promise<Result<User, AppError>> {
    // does the user exists?
    const userId = UserId.reconstitute(input.id);
    const user = await this.userRepository.findUserById(userId);

    if (!user)
      return err(
        new AppError('USER_NOT_FOUND', `User with ID ${input.id} not found`),
      );

    const updates: { username?: string; lastUsernameChangedAt?: Date } = {};

    if (input.username !== undefined) {
      const newUsername = user
        .getUsername()
        .changeUsername(input.username, new Date());

      if (newUsername.isErr()) return err(newUsername.error);

      user.updateUsername(newUsername.value);

      updates.username = newUsername.value.toString();
      updates.lastUsernameChangedAt =
        newUsername.value.getLastUsernameChangedAt() ?? undefined;
    }

    if (Object.keys(updates).length > 0) {
      await this.userRepository.updateUser(userId, updates);
    }

    return ok(user);
  }
}
