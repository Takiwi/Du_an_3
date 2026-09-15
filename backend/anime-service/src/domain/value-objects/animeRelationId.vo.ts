import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class AnimeRelationId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static createId() {
    return new AnimeRelationId(EntityId.generateId());
  }

  static create(id: string): Result<AnimeRelationId, AppError> {
    const result = super.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new AnimeRelationId(id));
  }

  static reconstitute(id: string) {
    return new AnimeRelationId(id);
  }
}
