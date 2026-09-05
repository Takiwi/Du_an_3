import { ApiProperty } from '@nestjs/swagger';
import { STATUS, ROLE } from '@generated/prisma/enums';

export class AuthResponseDto {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  username?: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ enum: STATUS, example: STATUS.ACTIVE })
  status: string;

  @ApiProperty({ enum: ROLE, example: ROLE.USER })
  role: string;

  constructor(
    id: string,
    email: string,
    status: string,
    role: string,
    username?: string,
  ) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.role = role;
    this.username = username;
  }
}
