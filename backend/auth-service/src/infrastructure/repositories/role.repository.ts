import { Role } from '@domain/entities/authorization/role.entity';
import { IRoleRepository } from '@domain/repositories/IRole.repository';
import { RoleId } from '@domain/value-objects/roleId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyRoleAndPermissionById(id: RoleId[]): Promise<Role[]> {
    const results = await this.prismaService.role.findMany({
      where: {
        id: {
          in: id.map((role) => role.getRoleId()),
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
}
