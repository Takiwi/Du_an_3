import { ApplicationErrorCode } from '../../identity/application/errors/application.error';
import { PresentationErrorCode } from '../../identity/presentation/errors/validationField.error';
import { ApiErrorResponse } from './apiErrorResponse.decorator';

export type errorCode = keyof typeof mapDecorator;

export const mapDecorator = {
  EMAIL_ALREADY_EXISTS: ApiErrorResponse(
    ApplicationErrorCode.EMAIL_ALREADY_EXISTS,
    'The email address has already been used',
    {
      description: 'Email already exists',
    },
  ),
  VALIDATION_ERROR: ApiErrorResponse(
    PresentationErrorCode.VALIDATION_ERROR,
    'Validation false',
    {
      description: 'Validation failed',
      isArray: true,
    },
  ),
  INTERNAL_SERVER_ERROR: ApiErrorResponse(
    'INTERNAL_SERVER_ERROR',
    'The service is experiencing an error; please try again later.',
    {
      description: 'Internal server error',
    },
  ),
};
