import { AppError } from "../errors/app.error.js";

export function formatErrorResponse(
  error: AppError,
  requestId: string | string[] | undefined,
) {
  return {
    success: false,
    isOperational: true,
    requestId: requestId,
    error: { code: error.code, message: error.message, meta: error.meta },
    timeStamp: new Date().toISOString(),
  };
}
