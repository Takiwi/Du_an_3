import { randomUUID } from 'crypto';

type STATUS = 'ACTIVE' | 'BANNED' | 'INACTIVE';
type ROLE = 'USER' | 'ADMIN';

export class User {
  readonly _id: string;
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
    status: STATUS = 'INACTIVE',
    role: ROLE = 'USER',
  ) {
    this._id = id;
    this._email = email;
    this._username = username;
    this._password = password;
    this._status = status;
    this._role = role;
  }

  static create(props: { username: string; email: string; password: string }) {
    return new User(randomUUID(), props.username, props.email, props.password);
  }

  static fromPrismaEntity(dto: {
    id: string;
    username: string;
    email: string;
    password: string;
    status: STATUS;
    role: ROLE;
  }) {
    return new User(
      dto.id,
      dto.username,
      dto.email,
      dto.password,
      dto.status,
      dto.role,
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

  public get role(): string {
    return this._role;
  }
}
