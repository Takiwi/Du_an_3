import { UserId } from '@auth/domain/value-objects/userId.vo';

export const BLACKLIST_TOKEN = Symbol('BLACKLIST_TOKEN');

export interface IBlacklist {
  insertToken(userId: UserId, accessToken: string): Promise<void>;
}
