import { randomUUID } from 'node:crypto';
import { AccountStatus } from '../../value-objects/accountStatus.vo';
import { AccountId } from '../../value-objects/accountId.vo';
import { Password } from '../../value-objects/password.vo';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import {
  BaseAccount,
  PureAccount,
  Role,
  FullAccount,
} from './account.contract';

export class Account {
  private readonly _id: AccountId;
  private _email: string;
  private _password: Password;
  private _status: AccountStatus;
  private _role: Role;

  private constructor(
    id: AccountId,
    email: string,
    password: Password,
    status: AccountStatus,
    role: Role,
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._status = status;
    this._role = role;
  }

  private static create(props: FullAccount): Result<Account, AppError> {
    const accountIdResult = AccountId.create(props.id ?? randomUUID());
    const passwordResult = Password.create(props.password);

    const combineResult = Result.combine([accountIdResult, passwordResult]);

    if (combineResult.isErr()) {
      return err(combineResult.error);
    }

    const [accountId, password] = combineResult.value;

    return ok(
      new Account(accountId, props.email, password, props.status, props.role),
    );
  }

  static baseEntity(props: BaseAccount): Result<Account, AppError> {
    const defaultStatus = AccountStatus.active();
    const defaultRole: Role = 'USER';

    return this.create({ ...props, status: defaultStatus, role: defaultRole });
  }

  static createByAdmin(props: BaseAccount): Result<Account, AppError> {
    const defaultStatus = AccountStatus.banned();
    const defaultRole: Role = 'USER';

    return this.create({ ...props, status: defaultStatus, role: defaultRole });
  }

  static reconstitute(props: PureAccount): Account {
    const userStatus = AccountStatus.reconstitute(props.status);
    const accountId = AccountId.reconstitute(props.id);
    const password = Password.reconstitute(props.password);

    return new Account(
      accountId,
      props.email,
      password,
      userStatus,
      props.role,
    );
  }

  getId(): AccountId {
    return this._id;
  }

  getEmail(): string {
    return this._email;
  }

  getStatus(): AccountStatus {
    return this._status;
  }

  updateStatus(status: AccountStatus): void {
    this._status = status;
  }

  getPassword(): Password {
    return this._password;
  }

  getRole(): Role {
    return this._role;
  }
}
