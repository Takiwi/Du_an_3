import { RoleId } from '@domain/value-objects/roleId.vo';
import { Action, BasePermission, Resource } from './permission.contract';

export type ROLE = 'ADMIN' | 'USER';

export interface BaseRole {
  name: string;
  max_members: number | null;
  permission?: BasePermission[];
}

export interface FullRole extends BaseRole {
  id: RoleId;
}

export interface PureRole extends BaseRole {
  id: string;
}

export type prismaRole = {
  id: string;
  name: string;
  max_members: number | null;
  role_permission?: ({
    permission: { id: string; action: Action; resource: Resource };
  } & { permissionId: string; roleId: string })[];
};

export interface UpdateRoleProps {
  name?: string;
  max_members?: number | null;
}
