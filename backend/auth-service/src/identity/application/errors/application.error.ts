import { AppError } from '@packages/core/errors/app.error';

export enum ApplicationErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
}

export class UserNotFoundError extends AppError {
  readonly code = ApplicationErrorCode.USER_NOT_FOUND;

  constructor(userId: string) {
    super(`User with ID ${userId} was not found.`);
  }
}

export class UserAlreadyExistsException extends AppError {
  readonly code = ApplicationErrorCode.EMAIL_ALREADY_EXISTS;

  constructor(email: string) {
    super(`User with email ${email} is already exists.`);
  }
}
