import { applyDecorators } from '@nestjs/common';
import { errorCode, mapDecorator } from './mapDecorator';

export const ApplyApiErrorsResponse = (errors: errorCode[]) => {
  const decorators = errors.map((error) => mapDecorator[error]);

  return applyDecorators(...decorators);
};
