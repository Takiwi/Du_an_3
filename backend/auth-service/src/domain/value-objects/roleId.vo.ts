import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class RoleId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static createId(): RoleId {
    const result = EntityId.generateId();

    return new RoleId(result);
  }

  static create(id: string): Result<RoleId, AppError> {
    const result = EntityId.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new RoleId(id));
  }

  static reconstitute(id: string) {
    return new RoleId(id);
  }

  static toRoleIdArray(roles: string[]) {
    return roles.map((role) => new RoleId(role));
  }

  toString() {
    return this._id;
  }
}
