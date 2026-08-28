import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { ValidationDetailDto } from "../dto/validationErrorDetail.dto";
import { MetaDto } from "../dto/meta.dto";

export const ApiErrorResponse = (
  errorCode: string,
  status: number,
  message: string,
  options?: {
    description?: string;
    isArray?: boolean;
  },
) => {
  const hasDetails = options?.isArray === true;

  const baseProperties = {
    success: { type: "boolean", example: false },
    isOperational: {
      type: "boolean",
      example: status === 500 ? false : true,
    },
    code: { type: "string", example: errorCode },
    message: { type: "string", example: message },
    meta: { $ref: getSchemaPath(MetaDto) },
  };

  const properties = hasDetails
    ? {
        ...baseProperties,
        details: {
          type: "array",
          items: { $ref: getSchemaPath(ValidationDetailDto) },
        },
      }
    : baseProperties;

  const required = hasDetails
    ? ["success", "isOperational", "code", "message", "meta", "details"]
    : ["success", "isOperational", "code", "message", "meta"];

  return applyDecorators(
    ApiExtraModels(MetaDto, ValidationDetailDto),
    ApiResponse({
      status,
      description: options?.description ?? `Error response (status ${status})`,
      schema: {
        type: "object",
        properties,
        required,
      },
    }),
  );
};
