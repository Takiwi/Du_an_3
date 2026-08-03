import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponse } from './apiErrorResponse.decorator';
import { ValidationErrorDetail } from '../../identity/presentation/dto/responses/validationErrorDetail.dto';

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiErrorResponse(400, {
      description: 'Validation failed',
      model: ValidationErrorDetail,
      isArray: true,
    }),
    ApiErrorResponse(500, { description: 'Internal server error' }),
  );
};
