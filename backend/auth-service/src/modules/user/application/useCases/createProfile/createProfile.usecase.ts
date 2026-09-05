import { Inject, Injectable } from '@nestjs/common';
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '@user/domain/repositories/IUserProfile.repository';
import { UserProfile } from '@user/domain/entities/userProfile.entity';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { CreateProfileInput } from './createProfile.contract';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Result<UserProfile, AppError>> {
    const isTaken = await this.userProfileRepository.existsByUsername(
      input.username,
    );

    if (isTaken) {
      return err(
        new AppError(
          'USERNAME_ALREADY_EXISTS',
          `Username ${input.username} already exists`,
        ),
      );
    }

    const profileResult = UserProfile.create({
      id: input.id,
      username: input.username,
      email: input.email,
      status: input.status,
      role: input.role,
    });

    if (profileResult.isErr()) {
      return err(profileResult.error);
    }

    await this.userProfileRepository.insertProfile(profileResult.value);

    return ok(profileResult.value);
  }
}
