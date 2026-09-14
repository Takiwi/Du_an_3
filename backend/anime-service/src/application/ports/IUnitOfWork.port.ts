import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export const TRANSACTION_ROLLBACK_ERROR = 'IUnitOfWork';

export interface IUnitOfWork {
  runInTransaction<T>(
    work: () => Promise<Result<T, AppError>>,
  ): Promise<Result<T, AppError>>;
}
