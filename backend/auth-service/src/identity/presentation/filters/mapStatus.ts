import { HttpStatus } from '@nestjs/common';
import { AppError } from '@packages/core/errors/app.error';

export function mapAppErrorToStatus(error: AppError) {
  switch (error.code) {
    case 'USER_NOT_FOUND':
      return HttpStatus.BAD_REQUEST;
    case 'EMAIL_ALREADY_EXISTS':
      return HttpStatus.CONFLICT;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
