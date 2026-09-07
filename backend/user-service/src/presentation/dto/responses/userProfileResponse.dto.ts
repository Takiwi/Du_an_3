import { ApiProperty } from '@nestjs/swagger';
import { STATUS } from '@generated/prisma/enums';

export class UserProfileResponseDto {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  username: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ enum: STATUS, example: STATUS.ACTIVE })
  status: string;

  constructor(id: string, username: string, email: string, status: string) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.status = status;
  }
}
