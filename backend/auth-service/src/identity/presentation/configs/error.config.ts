import { HttpStatus } from '@nestjs/common';
import { PresentationErrorCode } from '../errors/validationField.error';
import { ApplicationErrorCode } from '@auth/application/errors/application.error';
import { DomainErrorCode } from '@auth/domain/errors/domain.error';
import { ErrorDefinition } from '@packages/api-docs/decorators/applyApiErrorsResponse.decorator';

export type ErrorKeys =
  | keyof typeof DomainErrorCode
  | keyof typeof ApplicationErrorCode
  | keyof typeof PresentationErrorCode
  | 'INTERNAL_SERVER_ERROR';

export const ERROR_DEFINITIONS: Record<
  ErrorKeys,
  ErrorDefinition<ErrorKeys>
> = {
  USERNAME_INVALID_CHARS: {
    code: DomainErrorCode.USERNAME_INVALID_CHARS,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid username format',
    description: 'The username contains invalid characters',
  },
  USERNAME_RESERVED: {
    code: DomainErrorCode.USERNAME_RESERVED,
    status: HttpStatus.BAD_REQUEST,
    message: 'Username is not available',
    description: 'The username is reserved',
  },
  USERNAME_CHANGE_COOLDOWN: {
    code: DomainErrorCode.USERNAME_CHANGE_COOLDOWN,
    status: HttpStatus.CONFLICT,
    message: 'Username cannot be changed yet',
    description: 'The username change cooldown has not expired',
  },
  TOKEN_USED_DETECTED: {
    code: DomainErrorCode.TOKEN_USED_DETECTED,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Refresh token has already been used',
    description: 'The refresh token has already been used',
  },
  INVALID_TOKEN: {
    code: ApplicationErrorCode.INVALID_TOKEN,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Invalid token',
    description: 'The token is invalid or expired',
  },
  VALIDATION_TOKEN_FALSE: {
    code: PresentationErrorCode.VALIDATION_TOKEN_FALSE,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Invalid or expired token',
  },
  TOKEN_USED: {
    code: ApplicationErrorCode.TOKEN_USED,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Token has already been used',
  },
  TOKEN_NOT_FOUND: {
    code: ApplicationErrorCode.TOKEN_NOT_FOUND,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Token not found',
  },
  EMAIL_ALREADY_EXISTS: {
    code: ApplicationErrorCode.EMAIL_ALREADY_EXISTS,
    status: HttpStatus.BAD_REQUEST,
    message: 'Email already exists',
    description: 'Email already exists',
  },
  VALIDATION_ERROR: {
    code: PresentationErrorCode.VALIDATION_ERROR,
    status: HttpStatus.BAD_REQUEST,
    message: 'Information verification false',
    description: 'Validation failed',
    isArray: true,
  },
  USER_NOT_FOUND: {
    code: ApplicationErrorCode.USER_NOT_FOUND,
    status: HttpStatus.BAD_REQUEST,
    message: 'User has not registered an account',
    description: 'User not found',
  },
  EMAIL_NOT_FOUND: {
    code: ApplicationErrorCode.EMAIL_NOT_FOUND,
    status: HttpStatus.BAD_REQUEST,
    message: 'User has not registered an account',
    description: 'Email not found',
  },
  PASSWORD_DO_NOT_MATCH: {
    code: ApplicationErrorCode.PASSWORD_DO_NOT_MATCH,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Email or password is incorrect',
    description: 'Password do not match',
  },
  USER_BANNED: {
    code: ApplicationErrorCode.USER_BANNED,
    status: HttpStatus.FORBIDDEN,
    message: 'The account has been banned',
    description: 'The account has been banned',
  },
  TOO_MANY_ATTEMPTS: {
    code: ApplicationErrorCode.TOO_MANY_ATTEMPTS,
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: 'The account has been banned',
    description: 'Too many request',
  },
  SAME_CURRENT_PASSWORD: {
    code: ApplicationErrorCode.SAME_CURRENT_PASSWORD,
    status: HttpStatus.BAD_REQUEST,
    message: 'Password was not changed',
    description: 'The new password must differ from the current password',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'The service is experiencing an error; please try again later.',
    description: 'Internal server error',
  },
};
