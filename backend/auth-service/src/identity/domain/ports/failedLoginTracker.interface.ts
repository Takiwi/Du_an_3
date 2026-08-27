import { UserId } from '../value-objects/userId.vo';

export const FAILED_LOGIN_TRACKER_TOKEN = Symbol('FAILED_LOGIN_TRACKER_TOKEN');

export interface IFailedLoginTracker {
  incrementAndGet(userId: UserId): Promise<number>;
  // reset(userId: UserId): Promise<void>;
}
