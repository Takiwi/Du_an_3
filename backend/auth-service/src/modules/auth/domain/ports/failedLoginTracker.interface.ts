import { AccountId } from '../value-objects/accountId.vo';

export const FAILED_LOGIN_TRACKER_TOKEN = Symbol('FAILED_LOGIN_TRACKER_TOKEN');

export interface IFailedLoginTracker {
  incrementAndGet(accountId: AccountId): Promise<number>;
}
