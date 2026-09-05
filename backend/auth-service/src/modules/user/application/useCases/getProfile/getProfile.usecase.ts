import { Inject, Injectable } from '@nestjs/common';
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '@user/domain/repositories/IUserProfile.repository';
import { AppError } from '@packages/pattern';
import { UserProfile } from '@user/domain/entities/userProfile.entity';
import { UserId } from '@user/domain/value-objects/userId.vo';
import { ok, err, Result } from 'neverthrow';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(userId: string): Promise<Result<UserProfile, AppError>> {
    const idResult = UserId.create(userId);

    if (idResult.isErr()) return err(idResult.error);

    const profile = await this.userProfileRepository.findById(idResult.value);

    if (!profile) {
      return err(
        new AppError(
          'USER_NOT_FOUND',
          `User Id: ${idResult.value.toString()} not found`,
        ),
      );
    }

    return ok(profile);
  }
}
