import { AppError } from '@packages/contracts/errors/app.error';
import { AUTH_ERROR_CODES } from '@packages/contracts/constants/authErrorCode';

export function mapStatus(error: AppError): number {
  return AUTH_ERROR_CODES[error.code];
}
