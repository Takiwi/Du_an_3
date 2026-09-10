import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class PermissionId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static createId() {
    return new PermissionId(EntityId.generateId());
  }

  static create(id: string): Result<PermissionId, AppError> {
    const result = EntityId.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new PermissionId(id));
  }

  static reconstitute(id: string) {
    return new PermissionId(id);
  }

  getId() {
    return this._id;
  }
}
