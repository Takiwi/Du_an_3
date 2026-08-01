import { BaseEntity } from '../shared/base.entity';

type STATUS = 'ACTIVE' | 'BANNED' | 'INACTIVE';
type ROLE = 'USER' | 'ADMIN';

export class User extends BaseEntity {
  readonly id: string;
  private _username: string;
  private _email: string;

  private _password: string;
  private _status: STATUS;
  private _role: ROLE;

  readonly createdAt: Date;
  protected _updatedAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    status: STATUS,
    role: ROLE,
    createdAt: Date,
    updateAt: Date,
  ) {
    super();
    this.id = id;
    this._email = email;
    this._username = username;
    this._password = password;
    this._status = status;
    this._role = role;
    this.createdAt = createdAt ?? new Date();
    this._updatedAt = updateAt ?? new Date();
  }

  static fromPrismaEntity(dto: {
    id: string;
    username: string;
    email: string;
    password: string;
    status: STATUS;
    role: ROLE;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new User(
      dto.id,
      dto.username,
      dto.email,
      dto.password,
      dto.status,
      dto.role,
      dto.createdAt,
      dto.updatedAt,
    );
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
