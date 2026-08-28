import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { fail, ok, Result, AppError } from '@packages/pattern';
import { User } from '@auth/domain/entities/user.entity';
import { UserId } from '@auth/domain/value-objects/userId.vo';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<User, AppError>> {
    const id = UserId.create(userId);

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      return fail(
        new AppError('USER_NOT_FOUND', `User Id: ${id.toString()} not found`),
      );
    }

    return ok(user);
  }
}
