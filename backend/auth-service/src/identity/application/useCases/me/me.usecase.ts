import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { AppError } from '@packages/pattern';
import { User } from '@auth/domain/entities/user/user.entity';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { ok, err, Result } from 'neverthrow';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<User, AppError>> {
    const id = UserId.create(userId);

    if (id.isErr()) return err(id.error);

    const user = await this.userRepository.findUserById(id.value);

    if (!user) {
      return err(
        new AppError(
          'USER_NOT_FOUND',
          `User Id: ${id.value.toString()} not found`,
        ),
      );
    }

    return ok(user);
  }
}
