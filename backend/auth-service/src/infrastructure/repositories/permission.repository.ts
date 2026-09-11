import {
  Action,
  Resource,
} from '@domain/entities/authorization/permission.contract';
import { Permission } from '@domain/entities/authorization/permission.entity';
import { IPermissionRepository } from '@domain/repositories/IPermission.repository';
import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async findAll(): Promise<Permission[]> {
    const results = await this.prismaService.permission.findMany();

    return results.map((result) => Permission.reconstitute(result));
  }

  async updatePermission(permission: Permission): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.permission.update({
        where: {
          id: permission.getId().toString(),
        },
        data: {
          action: permission.getAction(),
          resource: permission.getResource(),
        },
      });
    });
  }

  async findById(id: PermissionId): Promise<Permission | null> {
    const result = await this.prismaService.permission.findUnique({
      where: {
        id: id.getId(),
      },
    });

    return result ? Permission.reconstitute(result) : null;
  }

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
      await this.client.permission.create({
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
      await this.client.permission.delete({
        where: {
          id: permissionId.toString(),
        },
      });
    });
  }
  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prismaService);
  }
}
