import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../presentation/dto/errorResponse.dto';

class EmptyDetailDto {}

export const ApiErrorResponse = <TModel extends Type<any>>(
  status = 500,
  options?: { description?: string; model?: TModel; isArray?: boolean },
) => {
  const model = options?.model ?? EmptyDetailDto;

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
            },
          },
        ],
      },
    }),
  );
};
