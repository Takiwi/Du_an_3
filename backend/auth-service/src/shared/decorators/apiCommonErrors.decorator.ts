import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponse } from './apiErrorResponse.decorator';
import { ValidationErrorDetail } from '../../identity/presentation/dto/responses/validationErrorDetail.dto';
import { PresentationErrorCode } from '../../identity/presentation/errors/validationField.error';

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiErrorResponse(PresentationErrorCode.VALIDATION_ERROR, {
      description: 'Validation failed',
      model: ValidationErrorDetail,
      isArray: true,
    }),
    ApiErrorResponse('INTERNAL_SERVER_ERROR', {
      description: 'Internal server error',
    }),
  );
};
