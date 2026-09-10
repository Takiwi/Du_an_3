import { Permission } from '@domain/entities/authorization/permission.entity';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY_TOKEN,
} from '@domain/repositories/IPermission.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

interface CreatePermissionInput {
  action: string;
  resource: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(
    dto: CreatePermissionInput,
  ): Promise<Result<Permission, AppError>> {
    const permission = Permission.create(dto.action, dto.resource);

    if (permission.isErr()) return err(permission.error);

    const result = await this.permissionRepository.findByActionAndResource(
      permission.value.getAction(),
      permission.value.getResource(),
    );

    if (result) {
      return err(
        new AppError(
          'PERMISSION_ALREADY_EXISTS',
          `Action ${dto.action} and resource ${dto.resource} already exists`,
        ),
      );
    }

    await this.permissionRepository.insertPermission(permission.value);

    return ok(permission.value);
  }
}
