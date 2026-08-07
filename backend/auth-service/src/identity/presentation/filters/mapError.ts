import { HttpStatus } from '@nestjs/common';

export function mapCodeToGenericError(errorCode: string): {
  status: number;
  message: string;
} {
  switch (errorCode) {
    case 'USER_NOT_FOUND':
    case 'EMAIL_NOT_FOUND':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `User has not registered an account`,
      };
    case 'VALIDATION_ERROR':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Information verification false',
      };
    case 'EMAIL_ALREADY_EXISTS':
      return {
        status: HttpStatus.CONFLICT,
        message: 'The email is already use',
      };
    case 'PASSWORD_DO_NOT_MATCH':
      return { status: HttpStatus.UNAUTHORIZED, message: 'Incorrect password' };
    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'The service is experiencing an error; please try again later.',
      };
  }
}
