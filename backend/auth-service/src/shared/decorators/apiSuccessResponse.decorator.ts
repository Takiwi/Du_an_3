import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../presentation/dto/successResponse.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
