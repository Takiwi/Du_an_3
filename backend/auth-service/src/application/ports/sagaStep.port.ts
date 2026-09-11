import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export interface sagaStep<T> {
  execute(): Promise<Result<T, AppError>>;

  compensate(value: T): Promise<Result<void, AppError>>;
}
