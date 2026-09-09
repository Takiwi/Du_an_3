import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { Action, PurePermission, Resource } from './permission.contract';

export class Permission {
  private readonly id: PermissionId;
  private action: Action;
  private resource: Resource;

  private constructor(id: PermissionId, action: Action, resource: Resource) {
    this.id = id;
    this.action = action;
    this.resource = resource;
  }

  static create(action: Action, resource: Resource): Permission {
    const id = PermissionId.create();

    return new Permission(id, action, resource);
  }

  static defaultPermission() {
    const id = PermissionId.create();

    return new Permission(id, 'READ', 'ANIME_DATA');
  }

  static reconstitute(props: PurePermission) {
    const id = PermissionId.reconstitute(props.id);

    return new Permission(id, props.action, props.resource);
  }

  getId() {
    return this.id;
  }

  getAction() {
    return this.action;
  }

  getResource() {
    return this.resource;
  }
}
