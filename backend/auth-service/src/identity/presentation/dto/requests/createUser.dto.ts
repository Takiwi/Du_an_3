import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { RegisterInput } from '@auth/application/contracts/register.contract';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements RegisterInput {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString({ message: 'This filed must be a string' })
  @MinLength(2, { message: 'The username must have at least 2 characters' })
  @MaxLength(100, { message: 'The password must not exceed 100 characters' })
  username: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    format: 'password',
    example: '12345678',
    writeOnly: true,
    minLength: 8,
  })
  @IsString({ message: 'This filed must be a string' })
  @MinLength(8, { message: 'The password must have at least 8 characters' })
  @MaxLength(100, { message: 'The password must not exceed 100 characters' })
  password: string;

  constructor(username: string, email: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
