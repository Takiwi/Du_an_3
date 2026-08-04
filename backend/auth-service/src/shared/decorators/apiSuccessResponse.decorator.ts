import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../presentation/dto/successResponse.dto';

export const RESPONSE_MESSAGE_KEY = 'response_message';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  status = 200,
  model: TModel,
  message: string,
) => {
  SetMetadata(RESPONSE_MESSAGE_KEY, message);

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
              message: { type: 'string', example: message },
            },
          },
        ],
      },
    }),
  );
};
