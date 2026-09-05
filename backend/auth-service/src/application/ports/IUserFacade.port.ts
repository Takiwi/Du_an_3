import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export const USER_FACADE_TOKEN = 'IUserFacade';

export interface IUserFacade {
  validateUsername(username: string): Result<void, AppError>;
  isUsernameTaken(username: string): Promise<boolean>;
  createProfile(data: {
    id: string;
    username: string;
    email: string;
    status?: string;
    role?: string;
  }): Promise<Result<void, AppError>>;
}
