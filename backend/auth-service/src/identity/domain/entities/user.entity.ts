import { AccountStatus, STATUS } from '../value-objects/accountStatus.vo';
import { UserId } from '../value-objects/userId.vo';
import { unwrapResult } from '@packages/core/helpers/resultPattern';

export type ROLE = 'USER' | 'ADMIN';

export class User {
  private readonly _id: UserId;
  private _username: string;
  private _email: string;

  private _password: string;
  private _status: AccountStatus;
  private _role: ROLE;

  private constructor(
    id: UserId,
    username: string,
    email: string,
    password: string,
    status: AccountStatus,
    role: ROLE = 'USER',
  ) {
    this._id = id;
    this._email = email;
    this._username = username;
    this._password = password;
    this._status = status;
    this._role = role;
  }

  static create(props: {
    username: string;
    email: string;
    password: string;
    status?: AccountStatus;
    role?: ROLE;
  }) {
    const userStatus = props.status ?? AccountStatus.active();
    const userId = UserId.generate();

    return new User(
      userId,
      props.username,
      props.email,
      props.password,
      userStatus,
      props.role,
    );
  }

  static fromPrismaEntity(props: {
    id: string;
    username: string;
    email: string;
    password: string;
    status: STATUS;
    role: ROLE;
  }) {
    const userStatus = new AccountStatus({ status: props.status });
    const userId = unwrapResult(UserId.create(props.id));

    return new User(
      userId,
      props.username,
      props.email,
      props.password,
      userStatus,
      props.role,
    );
  }

  getId() {
    return this._id;
  }

  getUsername() {
    return this._username;
  }

  getEmail() {
    return this._email;
  }

  getStatus() {
    return this._status;
  }

  updateStatus(status: AccountStatus) {
    this._status = status;
  }

  getPassword() {
    return this._password;
  }

  getRole() {
    return this._role;
  }
}
