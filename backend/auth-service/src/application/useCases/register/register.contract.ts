import { CreateAccountInput } from '@application/sagas/account/account.contract';
import { Account } from '@domain/entities/account/account.entity';

export type RegisterInputUseCase = Omit<CreateAccountInput, 'username'> & {
  profileId: string;
};

export interface RegisterOutputUseCase {
  account: Account;
  role: string[];
}
