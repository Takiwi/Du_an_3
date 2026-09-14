import { CreatePermissionUseCase } from '@application/useCases/permission/createPermission.usecase';
import { DeletePermissionUseCase } from '@application/useCases/permission/deletePermission.usecase';
import { GetPermissionListUseCase } from '@application/useCases/permission/getPermissionList.usecase';
import { UpdatePermissionUseCase } from '@application/useCases/permission/updatePermission.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '@packages/authorization';
import { CreatePermissionDto } from '@presentation/dto/requests/createPermission.dto';
import { UpdatePermissionDto } from '@presentation/dto/requests/updatePermission.dto';
import { PermissionMapper } from '@presentation/mappers/permission.mapper';

@Roles('ADMIN')
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly getPermissionListUseCase: GetPermissionListUseCase,
  ) {}

  @Post('create')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result =
      await this.createPermissionUseCase.execute(createPermissionDto);

    if (result.isErr()) throw result.error;

    return PermissionMapper.toResponseDto(result.value);
  }

  @Delete('delete/:id')
  async delete(@Param() id: string) {
    const result = await this.deletePermissionUseCase.execute(id);

    if (result.isErr()) throw result.error;
  }

  @Patch('update/:id')
  async update(
    @Param() id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const result = await this.updatePermissionUseCase.execute(
      id,
      updatePermissionDto,
    );

    if (result.isErr()) throw result.error;

    return PermissionMapper.toResponseDto(result.value);
  }

  @Get('')
  async getPermissionList() {
    return PermissionMapper.toArrayResponseDto(
      await this.getPermissionListUseCase.execute(),
    );
  }
}
