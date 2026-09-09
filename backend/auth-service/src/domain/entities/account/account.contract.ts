import { RoleId } from '@domain/value-objects/roleId.vo';
import { AccountStatus } from '../../value-objects/accountStatus.vo';

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
  role: string[];
}

export interface FullAccount {
  id?: string;
  email: string;
  password: string;
  status: AccountStatus;
  role: RoleId[];
}
