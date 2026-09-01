import { AppError, EntityId } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';

export class UserId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(id: string): Result<UserId, AppError> {
    const result = EntityId.validateUUID(id);

    if (!result.isOk()) {
      return err(result.error);
    }

    return ok(new UserId(id));
  }

  static reconstitute(id: string) {
    return new UserId(id);
  }
}
