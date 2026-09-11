import { Role } from '@domain/entities/authorization/role.entity';
import { IRoleRepository } from '@domain/repositories/IRole.repository';
import { RoleId } from '@domain/value-objects/roleId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async findByName(name: string): Promise<Role | null> {
    const result = await this.prismaService.role.findUnique({
      where: {
        name,
      },
    });

    return result ? Role.reconstitute(result) : null;
  }

  async findAll(): Promise<Role[]> {
    const result = await this.prismaService.role.findMany();

    return result.map((role) => Role.reconstitute(role));
  }

  async findById(roleId: RoleId): Promise<Role | null> {
    const result = await this.prismaService.role.findUnique({
      where: {
        id: roleId.toString(),
      },
    });

    return result ? Role.reconstitute(result) : null;
  }

  async updateRoleInfo(role: Role): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.role.update({
        where: {
          id: role.getRoleId().toString(),
        },
        data: { name: role.getRoleName(), max_members: role.getMax_members() },
      });
    });
  }

  async deleteRoleById(roleId: RoleId): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.role.delete({
        where: {
          id: roleId.toString(),
        },
      });
    });
  }

  async insertRoleById(role: Role): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.role.create({
        data: {
          id: role.getRoleId().toString(),
          name: role.getRoleName(),
          max_members: role.getMax_members(),
        },
      });
    });
  }

  async findManyRoleAndPermissionById(id: RoleId[]): Promise<Role[]> {
    const results = await this.prismaService.role.findMany({
      where: {
        id: {
          in: id.map((role) => role.toString()),
        },
      },
      include: {
        role_permission: {
          include: {
            permission: true,
          },
        },
      },
    });

    return results.map((role) => Role.reconstitute(role));
  }

  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prismaService);
  }
}
