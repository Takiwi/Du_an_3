import { UpdatePermissionProps } from '@domain/entities/authorization/permission.contract';
import { Permission } from '@domain/entities/authorization/permission.entity';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY_TOKEN,
} from '@domain/repositories/IPermission.repository';
import { PermissionId } from '@domain/value-objects/permissionId.vo';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(
    permissionId: string,
    dto: UpdatePermissionProps,
  ): Promise<Result<Permission, AppError>> {
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

    const newPermission = permission.update(dto);

    if (newPermission.isErr()) return err(newPermission.error);

    await this.permissionRepository.updatePermission(newPermission.value);

    return ok(newPermission.value);
  }
}
