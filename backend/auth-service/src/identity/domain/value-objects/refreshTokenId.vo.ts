import { EntityId, unwrapResult } from '@packages/pattern';

export class RefreshTokenId extends EntityId {
  protected constructor(id: string) {
    super(id);
  }

  static create(id: string): RefreshTokenId {
    unwrapResult(EntityId.validateUUID(id));

    return new RefreshTokenId(id);
  }
}
