import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { mapErrorCodeToStatus } from '../../identity/presentation/filters/mapStatus';
import { ValidationDetailDto } from '../../identity/presentation/dto/responses/validationErrorDetail.dto';
import { MetaDto } from '../presentation/dto/meta.dto';

export const ApiErrorResponse = (
  errorCode: string,
  message: string,
  options?: {
    description?: string;
    isArray?: boolean;
  },
) => {
  const status = mapErrorCodeToStatus(errorCode);
  const hasDetails = options?.isArray === true;

  const baseProperties = {
    success: { type: 'boolean', example: false },
    isOperational: {
      type: 'boolean',
      example: status === HttpStatus.INTERNAL_SERVER_ERROR ? false : true,
    },
    code: { type: 'string', example: errorCode },
    message: { type: 'string', example: message },
    meta: { $ref: getSchemaPath(MetaDto) },
  };

  const properties = hasDetails
    ? {
        ...baseProperties,
        details: {
          type: 'array',
          items: { $ref: getSchemaPath(ValidationDetailDto) },
        },
      }
    : baseProperties;

  const required = hasDetails
    ? ['success', 'isOperational', 'code', 'message', 'meta', 'details']
    : ['success', 'isOperational', 'code', 'message', 'meta'];

  return applyDecorators(
    ApiExtraModels(MetaDto, ValidationDetailDto),
    ApiResponse({
      status,
      description: options?.description ?? `Error response (status ${status})`,
      schema: {
        type: 'object',
        properties,
        required,
      },
    }),
  );
};
