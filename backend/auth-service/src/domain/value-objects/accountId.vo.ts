import { AppError, EntityId } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class AccountId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static createId() {
    return new AccountId(EntityId.generateId());
  }

  static create(id: string): Result<AccountId, AppError> {
    const result = EntityId.validateUUID(id);

    if (result.isErr()) return err(result.error);

    return ok(new AccountId(id));
  }

  static reconstitute(id: string) {
    return new AccountId(id);
  }

  toString() {
    return this._id;
  }
}
