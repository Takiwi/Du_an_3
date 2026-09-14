import { RoleId } from '@domain/value-objects/roleId.vo';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { BaseRole, prismaRole, UpdateRoleProps } from './role.contract';
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
    const id = RoleId.createId();

    if (props.permission.length === 0) {
      return ok(new Role(id, props.name, [], props.max_members));
    }

    const permissions = Result.combine(
      props.permission.map((item) =>
        Permission.create(item.action, item.resource),
      ),
    );

    if (permissions.isErr()) {
      return err(permissions.error);
    }

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

    return ok(new Role(id, props.name, permissions.value, props.max_members));
  }

  static reconstitute(props: prismaRole) {
    const id = RoleId.reconstitute(props.id);

    const permissions = props.role_permission
      ? props.role_permission.map((rp) =>
          Permission.reconstitute(rp.permission),
        )
      : [];

    return new Role(id, props.name, permissions, props.max_members);
  }

  getRoleId() {
    return this.id;
  }

  getRoleName() {
    return this._name;
  }

  updateRoleName(name: string) {
    this._name = name;
  }

  getPermission() {
    return this._permission;
  }

  getMax_members() {
    return this._max_members;
  }

  updateMax_members(max_members: number | null) {
    if (max_members && this._max_members && max_members < this._max_members) {
      return err(
        new AppError(
          'INVALID_VALUE',
          'The new value must not be less than or equal to the current value.',
        ),
      );
    }

    this._max_members = max_members;
  }

  update(props: UpdateRoleProps): Role {
    return new Role(
      this.id,
      props.name ?? this._name,
      this._permission,
      props.max_members !== undefined ? props.max_members : this._max_members,
    );
  }
}
