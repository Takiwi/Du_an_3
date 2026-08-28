import { applyDecorators } from "@nestjs/common";
import { ApiErrorResponse } from "./apiErrorResponse.decorator";

export const ApiCommonErrors = () => {
  return applyDecorators(
    ApiErrorResponse("INTERNAL_SERVER_ERROR", 500, "ok", {
      description: "Internal server error",
    }),
  );
};
