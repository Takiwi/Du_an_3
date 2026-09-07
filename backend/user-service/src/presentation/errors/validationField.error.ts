import { BadRequestException } from '@nestjs/common';
import { ValidationDetailDto } from '../dto/validationErrorDetail.dto';

export const PresentationErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_TOKEN_FALSE: 'VALIDATION_TOKEN_FALSE',
} as const;

export class ValidationFieldException extends BadRequestException {
  readonly code = PresentationErrorCode.VALIDATION_ERROR;

  constructor(
    message: string,
    public readonly details: ValidationDetailDto[],
  ) {
    super({ message, details });
  }
}
