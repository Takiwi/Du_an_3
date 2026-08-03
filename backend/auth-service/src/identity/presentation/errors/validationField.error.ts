import { BadRequestException } from '@nestjs/common';

export enum PresentationErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class ValidationFieldException extends BadRequestException {
  readonly code = PresentationErrorCode.VALIDATION_ERROR;

  constructor(
    message: string,
    public readonly details: { field: string; constraints: string[] }[],
  ) {
    super({ message, details });
  }
}
