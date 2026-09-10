import {
  Action,
  Resource,
} from '@domain/entities/authorization/permission.contract';
import { Permission } from '@domain/entities/authorization/permission.entity';
import { PermissionId } from '@domain/value-objects/permissionId.vo';

export const PERMISSION_REPOSITORY_TOKEN = 'IPermissionRepository';

export interface IPermissionRepository {
  findByActionAndResource(
    action: Action,
    resource: Resource,
  ): Promise<Permission | null>;
  insertPermission(permission: Permission): Promise<void>;
  deleteById(permissionId: PermissionId): Promise<void>;
}
