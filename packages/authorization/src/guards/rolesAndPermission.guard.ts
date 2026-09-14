import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import "@packages/common";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { PERMISSION_KEYS } from "../decorators/permission.decorator";
import { AppError } from "@packages/pattern";

@Injectable()
export class RoleAndPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEYS,
      [context.getHandler(), context.getClass()],
    );

    // 1. Nếu route KHÔNG yêu cầu cả Role lẫn Permission -> Cho pass
    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Nếu route có yêu cầu nhưng user không tồn tại -> Block
    if (!user) return false;

    // 2. Kiểm tra Role (nếu có yêu cầu roles)
    const hasRole = requiredRoles?.length
      ? requiredRoles.some((role) => user.roles?.includes(role))
      : true;

    // 3. Kiểm tra Permission (nếu có yêu cầu permissions)
    const hasPermission = requiredPermissions?.length
      ? requiredPermissions.some((perm) => user.permissions?.includes(perm))
      : true;

    if (!hasRole || !hasPermission)
      throw new AppError("INSUFFICIENT_PERMISSION", "Insufficient permissions");

    return hasRole && hasPermission;
  }
}
