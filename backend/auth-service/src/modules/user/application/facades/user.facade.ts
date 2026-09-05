import { Inject, Injectable } from '@nestjs/common';
import { IUserFacade } from '@auth/application/ports/IUserFacade.port';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { Username } from '../../domain/value-objects/username.vo';
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUserProfile.repository';
import { CreateProfileUseCase } from '../useCases/createProfile/createProfile.usecase';

@Injectable()
export class UserFacade implements IUserFacade {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY_TOKEN)
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly createProfileUseCase: CreateProfileUseCase,
  ) {}

  validateUsername(username: string): Result<void, AppError> {
    const result = Username.firstUsername(username);
    if (result.isErr()) {
      return err(result.error);
    }
    return ok();
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    return await this.userProfileRepository.existsByUsername(username);
  }

  async createProfile(data: {
    id: string;
    username: string;
    email: string;
    status?: string;
    role?: string;
  }): Promise<Result<void, AppError>> {
    const result = await this.createProfileUseCase.execute({
      id: data.id,
      username: data.username,
      email: data.email,
      status: data.status,
      role: data.role,
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok();
  }
}
