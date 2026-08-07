import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponse } from './apiErrorResponse.decorator';

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiErrorResponse('INTERNAL_SERVER_ERROR', {
      description: 'Internal server error',
    }),
  );
};
