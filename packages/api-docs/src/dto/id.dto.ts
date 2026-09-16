import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdResponseDto {
  @ApiProperty({ example: '123abc-ada...' })
  @IsUUID('4', { message: 'This must be UUID version 4' })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
