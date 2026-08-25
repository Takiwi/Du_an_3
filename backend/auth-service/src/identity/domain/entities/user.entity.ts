import { randomUUID } from 'crypto';

export type STATUS = 'PENDING' | 'ACTIVE' | 'BANNED' | 'DEACTIVATED';

export type ROLE = 'USER' | 'ADMIN';

export class User {
  private readonly _id: string;
  private _username: string;
  private _email: string;

  private _password: string;
  private _status: STATUS;
  private _role: ROLE;

  private constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    status: STATUS,
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
    status?: STATUS;
    role?: ROLE;
  }) {
    const userStatus = props.status ?? 'ACTIVE';

    return new User(
      randomUUID(),
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
    return new User(
      props.id,
      props.username,
      props.email,
      props.password,
      props.status,
      props.role,
    );
  }

  public get id(): string {
    return this._id;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get status() {
    return this._status;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }
}
