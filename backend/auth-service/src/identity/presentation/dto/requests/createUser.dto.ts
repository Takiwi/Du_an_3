import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserInput } from '../../../application/contracts/createUser.contract';

export class CreateUserDto implements CreateUserInput {
  @IsString({ message: 'This filed must be a string' })
  @MinLength(2, { message: 'The username must have at least 2 characters' })
  @MaxLength(100, { message: 'The password must not exceed 100 characters' })
  username: string;

  @IsEmail()
  email: string;

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
