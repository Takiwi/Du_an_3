import { HttpStatus } from '@nestjs/common';

export function mapErrorCodeToStatus(errorCode: string) {
  switch (errorCode) {
    case 'USER_NOT_FOUND':
      return HttpStatus.BAD_REQUEST;
    case 'EMAIL_ALREADY_EXISTS':
      return HttpStatus.CONFLICT;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
