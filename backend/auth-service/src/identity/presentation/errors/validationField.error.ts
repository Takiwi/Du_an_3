import { BadRequestException } from '@nestjs/common';
import { ValidationDetailDto } from '../dto/responses/validationErrorDetail.dto';

export enum PresentationErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SESSION_ID_NOT_FOUND = 'SESSION_ID_NOT_FOUND',
}

export class ValidationFieldException extends BadRequestException {
  readonly code = PresentationErrorCode.VALIDATION_ERROR;

  constructor(
    message: string,
    public readonly details: ValidationDetailDto[],
  ) {
    super({ message, details });
  }
}
