import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@auth/domain/repositories/IUser.repository';
import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
import { User } from '@auth/domain/entities/user.entity';
import { AppError } from '@packages/core/errors/app.error';

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<User, AppError>> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return fail(
        new AppError('USER_NOT_FOUND', `User Id: ${userId} not found`),
      );
    }

    return ok(user);
  }
}
