import { EntityId } from '@packages/pattern';

export class PermissionId extends EntityId {
  private constructor(id: string) {
    super(id);
  }

  static create() {
    return new PermissionId(EntityId.generateId());
  }

  static reconstitute(id: string) {
    return new PermissionId(id);
  }
}
