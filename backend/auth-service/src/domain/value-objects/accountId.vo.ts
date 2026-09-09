import { EntityId } from '@packages/pattern';

export class AccountId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(): AccountId {
    const result = EntityId.generateId();

    return new AccountId(result);
  }

  static reconstitute(id: string) {
    return new AccountId(id);
  }
}
