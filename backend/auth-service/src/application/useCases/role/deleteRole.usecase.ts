import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@domain/repositories/IRole.repository';
import { RoleId } from '@domain/value-objects/roleId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(roleId: string): Promise<Result<void, AppError>> {
    const id = RoleId.create(roleId);

    if (id.isErr()) return err(id.error);

    await this.roleRepository.deleteRoleById(id.value);

    return ok();
  }
}
