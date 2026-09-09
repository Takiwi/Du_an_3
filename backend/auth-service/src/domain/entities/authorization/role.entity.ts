import { RoleId } from '@domain/value-objects/roleId.vo';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { BaseRole, prismaRole } from './role.contract';
import { Permission } from './permission.entity';

export type ROLE = 'ADMIN' | 'USER';

export class Role {
  private readonly id: RoleId;
  private _name: string;
  private _permission: Permission[];
  private _max_members: number | null;

  private constructor(
    id: RoleId,
    name: string,
    permission: Permission[],
    max_members: number | null,
  ) {
    this.id = id;
    this._name = name;
    this._permission = permission;
    this._max_members = max_members;
  }

  static create(props: BaseRole): Result<Role, AppError> {
    const id = RoleId.create();

    const permissions = props.permission.map((item) =>
      Permission.create(item.action, item.resource),
    );

    if (
      props.max_members &&
      (props.max_members <= 0 || props.max_members % 1 !== 0)
    ) {
      return err(
        new AppError(
          'INVALID_MEMBERS',
          'Number of roles must be an integer greater than 0',
        ),
      );
    }

    return ok(new Role(id, props.name, permissions, props.max_members));
  }

  static defaultRole() {
    const id = RoleId.create();
    const permission = [Permission.defaultPermission()];

    return new Role(id, 'USER', permission, null);
  }

  static reconstitute(props: prismaRole) {
    const id = RoleId.reconstitute(props.id);

    const permissions = props.role_permission.map((rp) =>
      Permission.reconstitute(rp.permission),
    );

    return new Role(id, props.name, permissions, props.max_members);
  }

  getRoleId() {
    return this.id;
  }

  getRole() {
    return this._name;
  }

  getPermission() {
    return this._permission;
  }

  getMax_members() {
    return this._max_members;
  }
}
