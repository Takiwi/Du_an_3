import { CreateProfileInput } from '@application/useCases/createProfile/createProfile.contract';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto implements CreateProfileInput {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString({ message: 'This field must be a string' })
  @MinLength(3, { message: 'The username must have at least 3 characters' })
  @MaxLength(30, { message: 'The username must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Usernames may only contain letters and numbers.',
  })
  username: string;

  @ApiProperty({ format: 'email', example: 'example@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}
