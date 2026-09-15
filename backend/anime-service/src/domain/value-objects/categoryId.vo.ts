import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class CategoryId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static createId() {
    return new CategoryId(EntityId.generateId());
  }

  static create(id: string): Result<CategoryId, AppError> {
    const result = super.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new CategoryId(id));
  }

  static reconstitute(id: string) {
    return new CategoryId(id);
  }
}
