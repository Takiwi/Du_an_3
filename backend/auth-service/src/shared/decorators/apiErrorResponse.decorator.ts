import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../presentation/dto/errorResponse.dto';
import { mapErrorCodeToStatus } from '../../identity/presentation/filters/mapStatus';

class EmptyDetailDto {}

export const ApiErrorResponse = <TModel extends Type<any>>(
  errorCode: string,
  options?: {
    description?: string;
    model?: TModel;
    isArray?: boolean;
  },
) => {
  const model = options?.model ?? EmptyDetailDto;
  const status = mapErrorCodeToStatus(errorCode);

  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto, model),
    ApiResponse({
      status,
      description: options?.description ?? `Error response (status ${status})`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiErrorResponseDto) },
          {
            properties: {
              details: options?.isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
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
