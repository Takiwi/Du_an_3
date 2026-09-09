import { CreateRoleInput } from '@application/useCases/role/createRole.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateRoleDto implements CreateRoleInput {
  @ApiProperty({ example: 'USER' })
  @IsString({ message: 'This must be a string' })
  name: string;

  @ApiProperty({ example: '10' })
  @Min(0)
  @IsInt({ message: 'This must be a number' })
  max_members: number | null;

  constructor(name: string, max_members: number | null) {
    this.name = name;
    this.max_members = max_members;
  }
}
