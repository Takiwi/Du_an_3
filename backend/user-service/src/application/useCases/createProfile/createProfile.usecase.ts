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
  ID_GENERATOR_TOKEN,
  IdGenerator,
} from '@application/ports/IdGenerator.port';
import {
  IMessagePublisher,
  MESSAGE_PUBLISHER,
} from '@application/ports/messagePublisher.port';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IdGenerator,
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
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
      id: this.idGenerator.generate(),
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
