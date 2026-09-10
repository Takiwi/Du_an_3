import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { Action, PurePermission, Resource } from './permission.contract';
import { err, ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

export class Permission {
  private readonly id: PermissionId;
  private action: Action;
  private resource: Resource;

  private constructor(id: PermissionId, action: Action, resource: Resource) {
    this.id = id;
    this.action = action;
    this.resource = resource;
  }

  static create(
    action: string,
    resource: string,
  ): Result<Permission, AppError> {
    const id = PermissionId.create();

    if (!['READ', 'WRITE', 'APPROVE'].includes(action)) {
      return err(new AppError('INVALID_ACTION', `Invalid action: ${action}`));
    }

    if (!['USER_DATA', 'ANIME_DATA', 'STREAM_DATA'].includes(resource)) {
      return err(
        new AppError('INVALID_RESOURCE', `Invalid resource: ${resource}`),
      );
    }

    return ok(new Permission(id, action as Action, resource as Resource));
  }

  static defaultPermission() {
    const id = PermissionId.create();

    return new Permission(id, 'READ', 'ANIME_DATA');
  }

  static reconstitute(props: PurePermission) {
    const id = PermissionId.reconstitute(props.id);

    return new Permission(
      id,
      props.action as Action,
      props.resource as Resource,
    );
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
