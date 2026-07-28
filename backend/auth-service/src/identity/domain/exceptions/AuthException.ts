import { AppError } from '@packages/contracts/errors/app.error';
import { AUTH_ERROR_CODES } from '../../presentation/constants/authErrorCode';

export class UserAlreadyExistsException extends AppError {
  code: string;

  constructor(code: keyof typeof AUTH_ERROR_CODES, message: string) {
    super(message);
    this.code = code;
  }
}
