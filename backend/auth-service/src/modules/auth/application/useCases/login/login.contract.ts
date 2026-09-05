import { Account } from '../../../domain/entities/account/account.entity';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  account: Account;
  accessToken: string;
  refreshToken: string;
}
