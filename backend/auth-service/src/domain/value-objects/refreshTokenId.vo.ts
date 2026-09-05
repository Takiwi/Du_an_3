import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class RefreshTokenId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(id: string): Result<RefreshTokenId, AppError> {
    const result = EntityId.validateUUID(id);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(new RefreshTokenId(id));
  }

  static reconstitute(id: string) {
    return new RefreshTokenId(id);
  }
}
