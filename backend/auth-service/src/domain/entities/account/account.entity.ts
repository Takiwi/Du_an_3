import { AccountStatus } from '../../value-objects/accountStatus.vo';
import { AccountId } from '../../value-objects/accountId.vo';
import { Password } from '../../value-objects/password.vo';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import { BaseAccount, PureAccount, FullAccount } from './account.contract';
import { Role } from '../authorization/role.entity';
import { RoleId } from '@domain/value-objects/roleId.vo';

export class Account {
  private readonly _id: AccountId;
  private _email: string;
  private _password: Password;
  private _status: AccountStatus;
  private _roles: RoleId[];

  private constructor(
    id: AccountId,
    email: string,
    password: Password,
    status: AccountStatus,
    role: RoleId[],
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._status = status;
    this._roles = role;
  }

  private static create(props: FullAccount): Result<Account, AppError> {
    const accountId = props.id
      ? AccountId.reconstitute(props.id)
      : AccountId.create();
    const password = Password.create(props.password);

    if (password.isErr()) {
      return err(password.error);
    }

    return ok(
      new Account(
        accountId,
        props.email,
        password.value,
        props.status,
        props.role,
      ),
    );
  }

  static baseEntity(props: BaseAccount): Result<Account, AppError> {
    const defaultStatus = AccountStatus.active();
    const defaultRole = [Role.defaultRole().getRoleId()];

    return this.create({ ...props, status: defaultStatus, role: defaultRole });
  }

  // static createByAdmin(props: BaseAccount): Result<Account, AppError> {
  //   const defaultStatus = AccountStatus.locked();
  //   const defaultRole: Role = 'USER';

  //   return this.create({ ...props, status: defaultStatus, role: defaultRole });
  // }

  static reconstitute(props: PureAccount): Account {
    const userStatus = AccountStatus.reconstitute(props.status);
    const accountId = AccountId.reconstitute(props.id);
    const password = Password.reconstitute(props.password);
    const roles = RoleId.toRoleIdArray(props.role);

    return new Account(accountId, props.email, password, userStatus, roles);
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

  updatePassword(plainPassword: string) {
    const password = Password.create(plainPassword);

    if (password.isErr()) return err(password.error);

    this._password = password.value;
  }

  getRole(): RoleId[] {
    return this._roles;
  }
}
