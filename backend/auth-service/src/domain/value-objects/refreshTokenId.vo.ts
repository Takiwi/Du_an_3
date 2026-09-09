import { EntityId } from '@packages/pattern';

export class RefreshTokenId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(): RefreshTokenId {
    const result = EntityId.generateId();

    return new RefreshTokenId(result);
  }

  static reconstitute(id: string) {
    return new RefreshTokenId(id);
  }
}
