import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginInput } from '@auth/application/useCases/login/login.contract';

export class LoginDto implements LoginInput {
  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    format: 'password',
    example: '12345678',
    writeOnly: true,
    minLength: 8,
  })
  @IsString({ message: 'This field must be a string' })
  @MinLength(8, { message: 'The password must have at least 8 characters' })
  @MaxLength(64, { message: 'The password must not exceed 64 characters' })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
