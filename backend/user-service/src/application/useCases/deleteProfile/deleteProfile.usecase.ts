import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '@domain/repositories/IUserProfile.repository';
import { UserId } from '@domain/value-objects/userId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class DeleteProfileUseCase {
  constructor(
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(userId: string): Promise<Result<void, AppError>> {
    // check profile
    const id = UserId.create(userId);

    if (id.isErr())
      return err(new AppError('INVALID_USER_ID', `Invalid user id: ${userId}`));

    const user = await this.userProfileRepository.findById(id.value);

    if (!user)
      return err(new AppError('USER_NOT_FOUND', `User ${userId} not found`));

    await this.userProfileRepository.deleteProfile(id.value);

    this.logger.info(`User ${userId} deleted`);

    return ok();
  }
}
