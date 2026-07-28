import { IsEmail, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  readonly id: string;

  @Min(2, { message: 'Username must have at latest 2 characters' })
  @Max(100, { message: 'Usernames must not exceed 100 characters.' })
  @IsString({ message: 'Username have to string' })
  readonly username: string;

  @IsEmail({}, { message: 'Email is not in the correct format' })
  readonly email: string;

  @IsString({ message: 'Username have to string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;

  readonly status: 'ACTIVE' | 'INACTIVE' | 'BANNED';

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.status = status;
  }
}
