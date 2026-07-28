import { AppError } from '@packages/contracts/errors/app.error';

export function formatErrorResponse(
  error: AppError,
  requestId: string | undefined,
) {
  return {
    success: false,
    isOperational: true,
    requestId: requestId,
    error: { code: error.code, message: error.message },
    timeStamp: new Date().toISOString(),
  };
}
