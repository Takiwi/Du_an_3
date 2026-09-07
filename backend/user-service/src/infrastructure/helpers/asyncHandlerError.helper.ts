import { AppError } from '@packages/pattern';
import { mapPrismaError } from '../mappers/prismaError.mapper';

export async function asyncHandlerError<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    const prismaError = mapPrismaError(error);

    if (prismaError.statusCode !== 500) {
      throw new AppError(prismaError.code, prismaError.message);
    }

    throw error;
  }
}
