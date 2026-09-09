import { UpdateRoleProps } from '@domain/entities/authorization/role.contract';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@domain/repositories/IRole.repository';
import { RoleId } from '@domain/value-objects/roleId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class UpdateRoleInfoUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(
    roleId: string,
    dto: UpdateRoleProps,
  ): Promise<Result<void, AppError>> {
    const id = RoleId.create(roleId);

    if (id.isErr()) return err(id.error);

    const role = await this.roleRepository.findById(id.value);

    if (!role)
      return err(
        new AppError('ROLE_NOT_FOUND', `Role has Id(${roleId} not found)`),
      );

    if (dto.max_members !== undefined) {
      role.updateMax_members(dto.max_members);
    }

    const updatedRole = role.update({
      name: dto.name,
      max_members: dto.max_members,
    });

    await this.roleRepository.updateRoleInfo(updatedRole);

    return ok();
  }
}
