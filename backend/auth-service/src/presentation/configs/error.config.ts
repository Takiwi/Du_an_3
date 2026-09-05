import { HttpStatus } from '@nestjs/common';
import { ErrorDefinition } from '@packages/api-docs';

export const ErrorCode = {
  // Domain errors
  INVALID_UUID: 'INVALID_UUID',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_FORMAT: 'PASSWORD_FORMAT',
  USERNAME_INVALID_LENGTH: 'USERNAME_INVALID_LENGTH',
  USERNAME_INVALID_CHARS: 'USERNAME_INVALID_CHARS',
  USERNAME_RESERVED: 'USERNAME_RESERVED',
  USERNAME_CHANGE_COOLDOWN: 'USERNAME_CHANGE_COOLDOWN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_USED_DETECTED: 'TOKEN_USED_DETECTED',

  // Application errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  PASSWORD_DO_NOT_MATCH: 'PASSWORD_DO_NOT_MATCH',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  TOKEN_USED: 'TOKEN_USED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  USER_BANNED: 'USER_BANNED',
  SAME_CURRENT_PASSWORD: 'SAME_CURRENT_PASSWORD',
  USERNAME_ALREADY_EXISTS: 'USERNAME_ALREADY_EXISTS',

  // Presentation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_TOKEN_FALSE: 'VALIDATION_TOKEN_FALSE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorKeys = keyof typeof ErrorCode;

export const ERROR_DEFINITIONS: Record<
  ErrorKeys,
  ErrorDefinition<ErrorKeys>
> = {
  USERNAME_ALREADY_EXISTS: {
    code: ErrorCode.USERNAME_ALREADY_EXISTS,
    status: HttpStatus.BAD_REQUEST,
    message: 'User already exists',
    description: 'User already exists',
  },
  INVALID_UUID: {
    code: ErrorCode.INVALID_UUID,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid identifier',
    description: 'The user identifier has an invalid UUID format',
  },
  INVALID_PASSWORD: {
    code: ErrorCode.INVALID_PASSWORD,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid password',
    description: 'The password cannot be empty',
  },
  PASSWORD_FORMAT: {
    code: ErrorCode.PASSWORD_FORMAT,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid password format',
    description: 'The password does not meet the required format',
  },
  USERNAME_INVALID_LENGTH: {
    code: ErrorCode.USERNAME_INVALID_LENGTH,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid username length',
    description: 'The username must be between 3 and 30 characters long',
  },
  USERNAME_INVALID_CHARS: {
    code: ErrorCode.USERNAME_INVALID_CHARS,
    status: HttpStatus.BAD_REQUEST,
    message: 'Invalid username format',
    description: 'The username contains invalid characters',
  },
  USERNAME_RESERVED: {
    code: ErrorCode.USERNAME_RESERVED,
    status: HttpStatus.BAD_REQUEST,
    message: 'Username is not available',
    description: 'The username is reserved',
  },
  USERNAME_CHANGE_COOLDOWN: {
    code: ErrorCode.USERNAME_CHANGE_COOLDOWN,
    status: HttpStatus.CONFLICT,
    message: 'Username cannot be changed yet',
    description: 'The username change cooldown has not expired',
  },
  TOKEN_USED_DETECTED: {
    code: ErrorCode.TOKEN_USED_DETECTED,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Refresh token has already been used',
    description: 'The refresh token has already been used',
  },
  INVALID_TOKEN: {
    code: ErrorCode.INVALID_TOKEN,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Invalid token',
    description: 'The token is invalid or expired',
  },
  VALIDATION_TOKEN_FALSE: {
    code: ErrorCode.VALIDATION_TOKEN_FALSE,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Invalid or expired token',
  },
  TOKEN_USED: {
    code: ErrorCode.TOKEN_USED,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Token has already been used',
  },
  TOKEN_NOT_FOUND: {
    code: ErrorCode.TOKEN_NOT_FOUND,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Validation false',
    description: 'Token not found',
  },
  EMAIL_ALREADY_EXISTS: {
    code: ErrorCode.EMAIL_ALREADY_EXISTS,
    status: HttpStatus.BAD_REQUEST,
    message: 'Email already exists',
    description: 'Email already exists',
  },
  VALIDATION_ERROR: {
    code: ErrorCode.VALIDATION_ERROR,
    status: HttpStatus.BAD_REQUEST,
    message: 'Information verification false',
    description: 'Validation failed',
    isArray: true,
  },
  USER_NOT_FOUND: {
    code: ErrorCode.USER_NOT_FOUND,
    status: HttpStatus.BAD_REQUEST,
    message: 'User has not registered an account',
    description: 'User not found',
  },
  EMAIL_NOT_FOUND: {
    code: ErrorCode.EMAIL_NOT_FOUND,
    status: HttpStatus.BAD_REQUEST,
    message: 'User has not registered an account',
    description: 'Email not found',
  },
  PASSWORD_DO_NOT_MATCH: {
    code: ErrorCode.PASSWORD_DO_NOT_MATCH,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Email or password is incorrect',
    description: 'Password do not match',
  },
  USER_BANNED: {
    code: ErrorCode.USER_BANNED,
    status: HttpStatus.FORBIDDEN,
    message: 'The account has been banned',
    description: 'The account has been banned',
  },
  TOO_MANY_ATTEMPTS: {
    code: ErrorCode.TOO_MANY_ATTEMPTS,
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: 'The account has been banned',
    description: 'Too many request',
  },
  SAME_CURRENT_PASSWORD: {
    code: ErrorCode.SAME_CURRENT_PASSWORD,
    status: HttpStatus.BAD_REQUEST,
    message: 'Password was not changed',
    description: 'The new password must differ from the current password',
  },
  INTERNAL_SERVER_ERROR: {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'The service is experiencing an error; please try again later.',
    description: 'Internal server error',
  },
};
