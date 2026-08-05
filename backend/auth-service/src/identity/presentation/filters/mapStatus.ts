import { HttpStatus } from '@nestjs/common';

export function mapErrorCodeToStatus(errorCode: string) {
  switch (errorCode) {
    case 'USER_NOT_FOUND':
    case 'NOT_FOUND_EMAIL':
    case 'VALIDATION_ERROR':
      return HttpStatus.BAD_REQUEST;
    case 'EMAIL_ALREADY_EXISTS':
      return HttpStatus.CONFLICT;
    case 'PASSWORD_DO_NOT_MATCH':
      return HttpStatus.UNAUTHORIZED;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
