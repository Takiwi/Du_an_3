import {
  Action,
  Resource,
} from '@domain/entities/authorization/permission.contract';
import { Permission } from '@domain/entities/authorization/permission.entity';
import { IPermissionRepository } from '@domain/repositories/IPermission.repository';
import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByActionAndResource(
    action: Action,
    resource: Resource,
  ): Promise<Permission | null> {
    const result = await this.prismaService.permission.findUnique({
      where: {
        action_resource: {
          action,
          resource,
        },
      },
    });

    return result ? Permission.reconstitute(result) : null;
  }

  async insertPermission(permission: Permission): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.prismaService.permission.create({
        data: {
          id: permission.getId().toString(),
          action: permission.getAction(),
          resource: permission.getResource(),
        },
      });
    });
  }

  async deleteById(permissionId: PermissionId): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.prismaService.permission.delete({
        where: {
          id: permissionId.toString(),
        },
      });
    });
  }
}
