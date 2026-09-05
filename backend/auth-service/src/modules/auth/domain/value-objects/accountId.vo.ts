import { AppError, EntityId } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';

export class AccountId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(id: string): Result<AccountId, AppError> {
    const result = EntityId.validateUUID(id);

    if (!result.isOk()) {
      return err(result.error);
    }

    return ok(new AccountId(id));
  }

  static reconstitute(id: string) {
    return new AccountId(id);
  }
}
