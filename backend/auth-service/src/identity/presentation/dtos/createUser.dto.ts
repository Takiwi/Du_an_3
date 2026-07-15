import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  readonly id: string;

  @IsString({ message: 'Username have to string' })
  readonly username: string;

  @IsEmail({}, { message: 'Email is not in the correct format' })
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;

  readonly status: string;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    status: string,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.status = status;
  }
}
