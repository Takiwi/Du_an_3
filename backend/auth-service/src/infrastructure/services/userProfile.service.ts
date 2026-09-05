import { IUserFacade } from '@application/ports/IUserFacade.port';
import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export class UserProfileService implements IUserFacade {
  validateUsername(username: string): Result<void, AppError> {
    throw new Error('Method not implemented.');
  }
  isUsernameTaken(username: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createProfile(data: {
    id: string;
    username: string;
    email: string;
    status?: string;
    role?: string;
  }): Promise<Result<void, AppError>> {
    throw new Error('Method not implemented.');
  }
}
