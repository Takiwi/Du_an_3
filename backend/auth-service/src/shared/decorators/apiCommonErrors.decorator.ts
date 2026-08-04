import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponse } from './apiErrorResponse.decorator';

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'The service is experiencing an error; please try again later.',
      {
        description: 'Internal server error',
      },
    ),
  );
};
