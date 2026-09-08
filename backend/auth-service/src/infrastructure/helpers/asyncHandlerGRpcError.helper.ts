import { mapGRpcError } from '@packages/grpc-contracts';

export async function asyncHandlerGRpcError<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    const gRpcError = (mapGRpcError as (error: unknown) => unknown)(error);

    throw gRpcError;
  }
}
