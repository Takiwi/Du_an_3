import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';

type STATUS = 'ACTIVE' | 'BANNED' | 'INACTIVE';

export class User extends BaseEntity {
  readonly id: string;
  private _username: string;
  private _email: string;

  @Exclude()
  private _password: string;
  private _status: STATUS;

  readonly createAt: Date;
  protected _updateAt: Date;

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
    this._updateAt = updateAt ?? new Date();
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
}
