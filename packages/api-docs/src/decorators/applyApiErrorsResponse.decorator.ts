import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiErrorResponse } from "./apiErrorResponse.decorator";

export interface ErrorDefinition<T> {
  code: T;
  status: HttpStatus;
  message: string;
  description: string;
  isArray?: boolean;
}

export const ApplyApiErrorsResponse = <K extends string, TCode extends string>(
  record: Record<K, ErrorDefinition<TCode>>,
  errors: K[],
) => {
  ``;
  const decorators = errors.map((error) => {
    const errorDefinition = record[error];
    return ApiErrorResponse(
      errorDefinition.code,
      errorDefinition.status,
      errorDefinition.message,
      {
        description: errorDefinition.description,
        isArray: errorDefinition.isArray,
      },
    );
  });

  return applyDecorators(...decorators);
};
