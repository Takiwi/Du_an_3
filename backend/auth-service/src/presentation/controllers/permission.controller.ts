import { CreatePermissionUseCase } from '@application/useCases/permission/createPermission.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { CreatePermissionDto } from '@presentation/dto/requests/createPermission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
  ) {}

  @Post('create')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result =
      await this.createPermissionUseCase.execute(createPermissionDto);

    if (result.isErr()) throw result.error;

    return;
  }
}
