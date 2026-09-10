import {
  IPermissionRepository,
  PERMISSION_REPOSITORY_TOKEN,
} from '@domain/repositories/IPermission.repository';
import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(permissionId: string): Promise<Result<void, AppError>> {
    const id = PermissionId.create(permissionId);

    if (id.isErr()) return err(id.error);

    const permission = await this.permissionRepository.findById(id.value);

    if (!permission)
      return err(
        new AppError(
          'PERMISSION_NOT_FOUND',
          `Permission id(${permissionId} not found)`,
        ),
      );

    await this.permissionRepository.deleteById(id.value);

    return ok();
  }
}
