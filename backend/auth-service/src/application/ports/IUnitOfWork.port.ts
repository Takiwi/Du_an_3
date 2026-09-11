export const TRANSACTION_ROLLBACK_ERROR = 'IUnitOfWork';

export interface IUnitOfWork {
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
