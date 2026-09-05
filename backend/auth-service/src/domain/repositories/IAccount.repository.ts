import { Account } from '../entities/account/account.entity';
import { AccountId } from '../value-objects/accountId.vo';
import { AccountStatus } from '../value-objects/accountStatus.vo';
import { Password } from '../value-objects/password.vo';

export const ACCOUNT_REPOSITORY_TOKEN = 'IAccountRepository';

export interface IAccountRepository {
  findById(id: AccountId): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  existsByEmail(email: string): Promise<boolean>;
  updateStatusById(id: AccountId, status: AccountStatus): Promise<Account>;
  updatePasswordById(id: AccountId, password: Password): Promise<Account>;
  insertAccount(account: Account, initialUsername?: string): Promise<void>;
}
