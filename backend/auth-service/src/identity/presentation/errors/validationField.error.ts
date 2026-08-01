import { AppError } from '@packages/contracts/errors/app.error';

export enum PresentationErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class ValidationFieldException extends AppError {
  readonly code = PresentationErrorCode.VALIDATION_ERROR;

  constructor(errors: Record<string, unknown>[]) {
    super('Validate false', errors);
  }
}
