import { AccountStatus } from '../../value-objects/accountStatus.vo';

export type Role = 'USER' | 'ADMIN';

export interface BaseAccount {
  id?: string;
  email: string;
  password: string;
}

export interface PureAccount {
  id: string;
  email: string;
  password: string;
  status: string;
  role: Role;
}

export interface FullAccount {
  id?: string;
  email: string;
  password: string;
  status: AccountStatus;
  role: Role;
}
