import { randomUUID } from 'node:crypto';
import { AccountStatus } from '../../value-objects/accountStatus.vo';
import { UserId } from '../../value-objects/userId.vo';
import { Password } from '../../value-objects/password.vo';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import { BaseUser, PureUser, Role, FullUser } from './user.contract';
import { Username } from '@auth/domain/value-objects/username.vo';

export class User {
  private readonly _id: UserId;
  private _username: Username;
  private _email: string;

  private _password: Password;
  private _status: AccountStatus;
  private _role: Role;

  private constructor(
    id: UserId,
    email: string,
    username: Username,
    password: Password,
    status: AccountStatus,
    role: Role,
  ) {
    this._id = id;
    this._email = email;
    this._username = username;
    this._password = password;
    this._status = status;
    this._role = role;
  }

  private static create(props: FullUser): Result<User, AppError> {
    const userIdResult = UserId.create(randomUUID());
    const passwordResult = Password.create(props.password);
    const usernameResult = Username.firstUsername(props.username);

    const combineResult = Result.combine([
      userIdResult,
      usernameResult,
      passwordResult,
    ]);

    if (combineResult.isErr()) {
      return err(combineResult.error);
    }

    const [userId, username, password] = combineResult.value;

    return ok(
      new User(
        userId,
        props.email,
        username,
        password,
        props.status,
        props.role,
      ),
    );
  }

  static baseEntity(props: BaseUser): Result<User, AppError> {
    const defaultStatus = AccountStatus.active();
    const defaultRole = 'USER';

    return this.create({ ...props, status: defaultStatus, role: defaultRole });
  }

  static createByAdmin(props: BaseUser): Result<User, AppError> {
    const defaultStatus = AccountStatus.banned();
    const defaultRole = 'USER';

    return this.create({ ...props, status: defaultStatus, role: defaultRole });
  }

  static reconstitute(props: PureUser) {
    const userStatus = AccountStatus.reconstitute(props.status);
    const userId = UserId.reconstitute(props.id);
    const password = Password.reconstitute(props.password);
    const username = Username.reconstitute(
      props.username,
      props.lastUsernameChangedAt,
    );

    return new User(
      userId,
      props.email,
      username,
      password,
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

  getLastUsernameChangedAt() {
    return this._username.getLastUsernameChangedAt();
  }

  updateUsername(username: Username) {
    this._username = username;
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
