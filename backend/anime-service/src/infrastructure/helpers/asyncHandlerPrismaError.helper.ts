import { AppError } from '@packages/pattern';
import { mapPrismaError } from '../mappers/prismaError.mapper';
import { err, ok, Result } from 'neverthrow';

export async function asyncHandlerPrismaError<T>(
  operation: () => Promise<T>,
): Promise<Result<T, AppError>> {
  try {
    return ok(await operation());
  } catch (error) {
    const prismaError = mapPrismaError(error);

    if (prismaError.statusCode !== 500) {
      return err(new AppError(prismaError.code, prismaError.message));
    }

    throw error;
  }
}
