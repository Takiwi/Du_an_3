import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class AnimeId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(id: string): Result<AnimeId, AppError> {
    const result = super.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new AnimeId(id));
  }

  static reconstitute(id: string) {
    return new AnimeId(id);
  }
}
