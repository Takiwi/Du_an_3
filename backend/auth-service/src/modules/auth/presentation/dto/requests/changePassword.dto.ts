import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    format: 'password',
    example: 'NewSecurePass123!',
    writeOnly: true,
    minLength: 8,
    maxLength: 64,
  })
  @IsString({ message: 'This field must be a string' })
  @MaxLength(64, { message: 'The password must not exceed 64 characters' })
  @IsStrongPassword({}, { message: 'Password is not strong enough.' })
  newPassword: string;

  constructor(newPassword: string) {
    this.newPassword = newPassword;
  }
}
