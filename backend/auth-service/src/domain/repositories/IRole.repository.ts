import { Role } from '@domain/entities/authorization/role.entity';
import { RoleId } from '@domain/value-objects/roleId.vo';

export const ROLE_REPOSITORY_TOKEN = 'IRoleRepository';

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(roleId: RoleId): Promise<Role | null>;
  findManyRoleAndPermissionById(ids: RoleId[]): Promise<Role[]>;
  insertRoleById(role: Role): Promise<void>;
  deleteRoleById(roleId: RoleId): Promise<void>;
  updateRoleInfo(role: Role): Promise<void>;
}
