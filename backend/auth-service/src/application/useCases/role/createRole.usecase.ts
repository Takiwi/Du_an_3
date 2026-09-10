import { Role } from '@domain/entities/authorization/role.entity';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@domain/repositories/IRole.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export interface CreateRoleInput {
  name: string;
  max_members: number | null;
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(dto: CreateRoleInput): Promise<Result<void, AppError>> {
    const role = Role.create({
      name: dto.name,
      max_members: dto.max_members,
      permission: [],
    });

    if (role.isErr()) return err(role.error);

    await this.roleRepository.insertRoleById(role.value);

    return ok();
  }
}
