import { AuthStatus } from '@generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  username?: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ enum: AuthStatus, example: AuthStatus.VERIFIED })
  status: string;

  @ApiProperty({ example: ['USER'] })
  role: string[];

  constructor(
    id: string,
    email: string,
    status: string,
    role: string[],
    username?: string,
  ) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.role = role;
    this.username = username;
  }
}
