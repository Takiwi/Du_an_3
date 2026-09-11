import { Inject, Injectable } from '@nestjs/common';
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '@domain/repositories/IUserProfile.repository';
import { UserProfile } from '@domain/entities/userProfile.entity';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { CreateProfileInput } from './createProfile.contract';
import {
  IMessagePublisher,
  MESSAGE_PUBLISHER,
} from '@application/ports/messagePublisher.port';
import { Username } from '@domain/value-objects/username.vo';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Result<UserProfile, AppError>> {
    const email = await this.userProfileRepository.findByEmail(input.email);

    if (email) {
      return err(
        new AppError(
          'EMAIL_ALREADY_EXISTS',
          `Email ${input.email} already exists`,
        ),
      );
    }

    const username = Username.create(input.username);

    if (username.isErr()) return err(username.error);

    const isTaken = await this.userProfileRepository.existsByUsername(
      username.value,
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
      username: input.username,
      email: input.email,
    });

    if (profileResult.isErr()) {
      return err(profileResult.error);
    }

    await this.userProfileRepository.insertProfile(profileResult.value);

    return ok(profileResult.value);
  }
}
