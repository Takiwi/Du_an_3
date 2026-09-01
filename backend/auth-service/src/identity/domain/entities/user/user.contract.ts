import {
  AccountStatus,
  STATUS,
} from '@auth/domain/value-objects/accountStatus.vo';

export type Role = 'USER' | 'ADMIN';

export interface BaseUser {
  username: string;
  email: string;
  password: string;
}

export interface FullUser extends BaseUser {
  status: AccountStatus;
  role: Role;
}

export interface PureUser extends BaseUser {
  id: string;
  status: STATUS;
  role: Role;
}
