import { BadRequestException } from '@nestjs/common';
import { ValidationErrorDetail } from '../dto/responses/validationErrorDetail.dto';

export enum PresentationErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class ValidationFieldException extends BadRequestException {
  readonly code = PresentationErrorCode.VALIDATION_ERROR;

  constructor(
    message: string,
    public readonly details: ValidationErrorDetail[],
  ) {
    super({ message, details });
  }
}
