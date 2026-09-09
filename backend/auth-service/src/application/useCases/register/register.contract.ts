import { Account } from '@domain/entities/account/account.entity';

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface RegisterOutput {
  account: Account;
  username: string;
  role: string[];
}
