import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegisterInput } from '../../../application/useCases/register/register.contract';
import { ApiProperty } from '@nestjs/swagger';
import { Username } from '@user/domain/value-objects/username.vo';

export class CreateUserDto implements RegisterInput {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString({ message: 'This field must be a string' })
  @MinLength(3, { message: 'The username must have at least 3 characters' })
  @MaxLength(30, { message: 'The username must not exceed 30 characters' })
  @Matches(Username.REGEX, {
    message: 'Usernames may only contain letters and numbers.',
  })
  username: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    format: 'password',
    example: '12345678',
    writeOnly: true,
    minLength: 8,
    maxLength: 64,
  })
  @IsString({ message: 'This field must be a string' })
  @MaxLength(64, { message: 'The password must not exceed 64 characters' })
  @IsStrongPassword({}, { message: 'Password is not strong enough.' })
  password: string;

  constructor(username: string, email: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
