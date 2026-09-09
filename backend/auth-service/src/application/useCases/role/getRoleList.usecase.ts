import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@domain/repositories/IRole.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetRoleList {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute() {
    return await this.roleRepository.findAll();
  }
}
