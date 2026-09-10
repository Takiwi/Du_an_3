import { PermissionId } from '@domain/value-objects/permissionId.vo';
import {
  Action,
  PurePermission,
  Resource,
  UpdatePermissionProps,
} from './permission.contract';
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
    const id = PermissionId.createId();

    const combined = Result.combine([
      Permission.isAction(action),
      Permission.isResource(resource),
    ]);

    if (combined.isErr()) return err(combined.error[0]);

    const [actionResult, resourceResult] = combined.value;

    return ok(new Permission(id, actionResult, resourceResult));
  }

  static defaultPermission() {
    const id = PermissionId.createId();

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

  update(props: UpdatePermissionProps): Result<Permission, AppError> {
    if (props.action) {
      const result = Permission.isAction(props.action);

      if (result.isErr()) return err(result.error);

      props.action = result.value;
    }

    if (props.resource) {
      const result = Permission.isResource(props.resource);

      if (result.isErr()) return err(result.error);

      props.resource = result.value;
    }

    return ok(
      new Permission(
        this.id,
        props.action ? (props.action as Action) : this.getAction(),
        props.resource ? (props.resource as Resource) : this.getResource(),
      ),
    );
  }

  static isAction(action: string): Result<Action, AppError> {
    if (!['READ', 'WRITE', 'APPROVE'].includes(action)) {
      return err(new AppError('INVALID_ACTION', `Invalid action: ${action}`));
    }

    return ok(action as Action);
  }

  static isResource(resource: string): Result<Resource, AppError> {
    if (!['USER_DATA', 'ANIME_DATA', 'STREAM_DATA'].includes(resource)) {
      return err(
        new AppError('INVALID_RESOURCE', `Invalid resource: ${resource}`),
      );
    }

    return ok(resource as Resource);
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
