import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './createRole.dto';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { UpdateRoleProps } from '@domain/entities/authorization/role.contract';

export class UpdateRoleDto
  extends PartialType(CreateRoleDto)
  implements UpdateRoleProps
{
  @ApiProperty({ format: 'uuid', example: '123asd-sdf....' })
  @IsUUID('4', { message: 'This must be UUID' })
  id: string;

  @ApiProperty({ type: [String], example: ['nestjs', 'typescript'] })
  @IsArray({ message: 'This must be a array' })
  @IsString({ each: true, message: `This must be a string array` })
  permission: string[];

  constructor(id: string, permission: string[]) {
    super();
    this.id = id;
    this.permission = permission;
  }
}
