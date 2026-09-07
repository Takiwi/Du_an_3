import { status } from '@grpc/grpc-js';
import { AppError } from '@packages/pattern';

interface GrpcClientError {
  code?: number;
  details?: string;
  message?: string;
}

interface GrpcErrorPayload {
  appErrorCode?: string;
  message?: string;
}

export function mapGRpcError(error: unknown): AppError {
  const grpcError = (error ?? {}) as GrpcClientError;
  const rawMessage =
    grpcError.details ?? grpcError.message ?? 'gRPC request failed';
  let payload: GrpcErrorPayload = {};

  try {
    payload = JSON.parse(rawMessage) as GrpcErrorPayload;
  } catch {
    // The gRPC client can return a plain-text details message.
  }

  const message = payload.message ?? rawMessage;
  const codeName = getGrpcStatusName(grpcError.code);

  switch (grpcError.code) {
    case status.NOT_FOUND:
      return createAppError(
        payload.appErrorCode ?? 'NOT_FOUND',
        message,
        codeName,
      );

    case status.INVALID_ARGUMENT:
      return createAppError(
        payload.appErrorCode ?? 'BAD_REQUEST',
        message,
        codeName,
      );

    case status.UNAUTHENTICATED:
      return createAppError(
        payload.appErrorCode ?? 'UNAUTHORIZED',
        message,
        codeName,
      );

    case status.PERMISSION_DENIED:
      return createAppError(
        payload.appErrorCode ?? 'FORBIDDEN',
        message,
        codeName,
      );

    case status.ALREADY_EXISTS:
      return createAppError(
        payload.appErrorCode ?? 'CONFLICT',
        message,
        codeName,
      );

    default:
      return createAppError(
        payload.appErrorCode ?? 'INTERNAL_ERROR',
        message,
        codeName,
      );
  }
}

function getGrpcStatusName(code?: number): string {
  if (code === undefined) return 'UNKNOWN';

  return (
    Object.entries(status).find(([, value]) => value === code)?.[0] ?? 'UNKNOWN'
  );
}

function createAppError(
  code: string,
  message: string,
  grpcCode: string,
): AppError {
  return new AppError(code, message, { grpcCode });
}
