import { BaseEntity } from './base.entity';

type STATUS = 'ACTIVE' | 'BANNED' | 'INACTIVE';

export class User extends BaseEntity {
  readonly id: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private _status: STATUS;

  readonly createAt: Date;
  protected updateAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    status: STATUS,
    createAt: Date,
    updateAt: Date,
  ) {
    super();
    this.id = id;
    this._email = email;
    this._username = username;
    this._password = password;
    this._status = status;
    this.createAt = createAt ?? new Date();
    this.updateAt = updateAt ?? new Date();
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
}
