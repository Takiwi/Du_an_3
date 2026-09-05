import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Username } from '../../../domain/value-objects/username.vo';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newUsername123' })
  @IsOptional()
  @IsString({ message: 'This field must be a string' })
  @MinLength(3, { message: 'The username must have at least 3 characters' })
  @MaxLength(30, { message: 'The username must not exceed 30 characters' })
  @Matches(Username.REGEX, {
    message: 'Usernames may only contain letters and numbers.',
  })
  username?: string;
}
