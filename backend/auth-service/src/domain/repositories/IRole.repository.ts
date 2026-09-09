import { Role } from '@domain/entities/authorization/role.entity';
import { RoleId } from '@domain/value-objects/roleId.vo';

export const ROLE_REPOSITORY_TOKEN = 'IRoleRepository';

export interface IRoleRepository {
  findManyRoleAndPermissionById(idList: RoleId[]): Promise<Role[]>;
}
