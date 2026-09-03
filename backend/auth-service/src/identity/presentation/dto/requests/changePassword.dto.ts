import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).*$/, {
    message: 'Password must contain at least 1 uppercase and 1 number',
  })
  newPassword: string;

  constructor(newPassword: string) {
    this.newPassword = newPassword;
  }
}
