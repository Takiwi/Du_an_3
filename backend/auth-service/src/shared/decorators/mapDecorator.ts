import { ApplicationErrorCode } from '../../identity/application/errors/application.error';
import { PresentationErrorCode } from '../../identity/presentation/errors/validationField.error';
import { ApiErrorResponse } from './apiErrorResponse.decorator';

export type errorCode = keyof typeof mapDecorator;

export const mapDecorator = {
  VALIDATION_TOKEN_FALSE: ApiErrorResponse(ApplicationErrorCode.TOKEN_USED, {
    description: 'Invalid or expired token',
  }),
  TOKEN_USED: ApiErrorResponse(ApplicationErrorCode.TOKEN_USED, {
    description: 'Token has already been used',
  }),
  TOKEN_NOT_FOUND: ApiErrorResponse(ApplicationErrorCode.TOKEN_NOT_FOUND, {
    description: 'Token not found',
  }),
  SESSION_ID_NOT_FOUND: ApiErrorResponse(
    PresentationErrorCode.SESSION_ID_NOT_FOUND,
    {
      description: 'Session id is missing',
    },
  ),
  EMAIL_ALREADY_EXISTS: ApiErrorResponse(
    ApplicationErrorCode.EMAIL_ALREADY_EXISTS,
    {
      description: 'Email already exists',
    },
  ),
  VALIDATION_ERROR: ApiErrorResponse(PresentationErrorCode.VALIDATION_ERROR, {
    description: 'Validation failed',
    isArray: true,
  }),
  USER_NOT_FOUND: ApiErrorResponse(ApplicationErrorCode.USER_NOT_FOUND, {
    description: 'User not found',
  }),
  EMAIL_NOT_FOUND: ApiErrorResponse(ApplicationErrorCode.EMAIL_NOT_FOUND, {
    description: 'Email not found',
  }),
  PASSWORD_DO_NOT_MATCH: ApiErrorResponse(
    ApplicationErrorCode.PASSWORD_DO_NOT_MATCH,
    {
      description: 'Password do not match',
    },
  ),
  INTERNAL_SERVER_ERROR: ApiErrorResponse('INTERNAL_SERVER_ERROR', {
    description: 'Internal server error',
  }),
};
