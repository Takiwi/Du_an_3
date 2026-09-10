import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto implements CreatePermissionDto {
  @ApiProperty({ example: 'READ' })
  @IsString({ message: 'This must be string' })
  action: string;

  @ApiProperty({ example: 'USER_DATA' })
  @IsString({ message: 'This must be string' })
  resource: string;

  constructor(action: string, resource: string) {
    this.action = action;
    this.resource = resource;
  }
}
