import { EntityId } from '@packages/pattern';

export class UserId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create(): UserId {
    const result = EntityId.generateId();

    return new UserId(result);
  }

  static reconstitute(id: string) {
    return new UserId(id);
  }
}
