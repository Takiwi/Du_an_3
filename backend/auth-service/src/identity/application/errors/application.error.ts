import { AppError } from '@packages/core/errors/app.error';

export enum ApplicationErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  NOT_FOUND_EMAIL = 'NOT_FOUND_EMAIL',
  PASSWORD_DO_NOT_MATCH = 'PASSWORD_DO_NOT_MATCH',
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

export class NotFoundEmailException extends AppError {
  readonly code = ApplicationErrorCode.NOT_FOUND_EMAIL;

  constructor(email: string) {
    super(`User with email ${email} is not found.`);
  }
}

export class PasswordDoNotMatchException extends AppError {
  readonly code = ApplicationErrorCode.PASSWORD_DO_NOT_MATCH;

  constructor() {
    super(`User with password do not match`);
  }
}
