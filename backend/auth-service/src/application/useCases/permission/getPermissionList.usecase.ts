import {
  IPermissionRepository,
  PERMISSION_REPOSITORY_TOKEN,
} from '@domain/repositories/IPermission.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetPermissionListUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute() {
    return await this.permissionRepository.findAll();
  }
}
