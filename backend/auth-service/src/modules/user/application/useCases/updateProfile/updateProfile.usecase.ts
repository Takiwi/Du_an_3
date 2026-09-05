import { Inject, Injectable } from '@nestjs/common';
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '@user/domain/repositories/IUserProfile.repository';
import { UserProfile } from '@user/domain/entities/userProfile.entity';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { UpdateProfileInput } from './updateProfile.contract';
import { GetProfileUseCase } from '../getProfile/getProfile.usecase';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  async execute(
    input: UpdateProfileInput,
  ): Promise<Result<UserProfile, AppError>> {
    const profileResult = await this.getProfileUseCase.execute(input.id);

    if (profileResult.isErr()) {
      return err(profileResult.error);
    }

    const profile = profileResult.value;

    if (input.username !== undefined) {
      const now = new Date();
      const newUsernameResult = profile
        .getUsername()
        .changeUsername(input.username, now);

      if (newUsernameResult.isErr()) return err(newUsernameResult.error);

      const existingUser = await this.userProfileRepository.findByUsername(
        newUsernameResult.value.toString(),
      );

      if (
        existingUser &&
        existingUser.getId().toString() !== profile.getId().toString()
      ) {
        return err(
          new AppError(
            'USERNAME_ALREADY_EXISTS',
            `Username ${input.username} already exists`,
          ),
        );
      }

      profile.updateUsername(newUsernameResult.value);

      const updatedProfile =
        await this.userProfileRepository.updateUsernameById(profile.getId(), {
          username: newUsernameResult.value.toString(),
          lastUsernameChangedAt: now,
        });

      return ok(updatedProfile);
    }

    return ok(profile);
  }
}
