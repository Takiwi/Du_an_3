import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponseDto } from '../presentation/dto/successResponse.dto';

export const RESPONSE_MESSAGE_KEY = 'response_message';

export const ApiSuccessResponse = <TModel extends Type<any>>({
  status = 200,
  model,
  message,
}: {
  status?: number;
  model?: TModel;
  message: string;
}) => {
  const dataSchema = model
    ? { $ref: getSchemaPath(model) }
    : { type: 'object', nullable: true, example: null };

  return applyDecorators(
    SetMetadata(RESPONSE_MESSAGE_KEY, message),
    ApiExtraModels(ApiSuccessResponseDto, ...(model ? [model] : [])),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            properties: {
              data: dataSchema,
              message: { type: 'string', example: message },
            },
          },
        ],
      },
    }),
  );
};
