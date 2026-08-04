import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../presentation/dto/errorResponse.dto';
import { mapErrorCodeToStatus } from '../../identity/presentation/filters/mapStatus';
import { ValidationErrorDetail } from '../../identity/presentation/dto/responses/validationErrorDetail.dto';

export const ApiErrorResponse = (
  errorCode: string,
  message: string,
  options?: {
    description?: string;
    isArray?: boolean;
  },
) => {
  const status = mapErrorCodeToStatus(errorCode);

  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({
      status,
      description: options?.description ?? `Error response (status ${status})`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiErrorResponseDto) },
          {
            properties: {
              message: { type: 'string', example: message },
              details: options?.isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(ValidationErrorDetail) },
                  }
                : { type: 'array', example: [] },
              code: { type: 'string', example: errorCode },
              isOperational: {
                type: 'boolean',
                example:
                  status === HttpStatus.INTERNAL_SERVER_ERROR ? false : true,
              },
            },
          },
        ],
      },
    }),
  );
};
