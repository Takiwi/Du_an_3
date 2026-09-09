import { EntityId } from '@packages/pattern';

export class RoleId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(): RoleId {
    const result = EntityId.generateId();

    return new RoleId(result);
  }

  static reconstitute(id: string) {
    return new RoleId(id);
  }

  static toRoleIdArray(roles: string[]) {
    return roles.map((role) => new RoleId(role));
  }

  getRoleId() {
    return this._id;
  }
}
