import { CreateRoleUseCase } from '@application/useCases/role/createRole.usecase';
import { DeleteRoleUseCase } from '@application/useCases/role/deleteRole.usecase';
import { GetRoleList } from '@application/useCases/role/getRoleList.usecase';
import { UpdateRoleInfoUseCase } from '@application/useCases/role/updateRole.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from '@presentation/dto/requests/createRole.dto';
import { UpdateRoleDto } from '@presentation/dto/requests/updateRole.dto';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleInfoUseCase: UpdateRoleInfoUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly getRoleList: GetRoleList,
  ) {}

  // role CRUD
  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.createRoleUseCase.execute(createRoleDto);

    if (result.isErr()) throw result.error;
  }

  @Patch('update/:id')
  async update(@Param() id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.updateRoleInfoUseCase.execute(id, updateRoleDto);

    if (result.isErr()) throw result.error;
  }

  @Delete('delete/:id')
  async delete(@Param() id: string) {
    const result = await this.deleteRoleUseCase.execute(id);

    if (result.isErr()) throw result.error;
  }

  @Get('')
  async roleList() {
    return await this.getRoleList.execute();
  }
}
