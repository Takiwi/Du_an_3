import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDetail {
  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({ example: ['must be a valid email', 'should not be empty'] })
  constraints: string[];

  constructor(field: string, constraints: string[]) {
    this.field = field;
    this.constraints = constraints;
  }
}
