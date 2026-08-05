import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    format: 'password',
    example: '12345678',
    writeOnly: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'The password must have at least 8 characters' })
  @MaxLength(100, { message: 'The password must not exceed 100 characters' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
