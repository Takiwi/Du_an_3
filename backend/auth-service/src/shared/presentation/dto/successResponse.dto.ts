import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';

export class ApiSuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success: true;

  data: T | null;

  @ApiProperty({ example: 'Thành công' })
  message: string;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  constructor(data: T, message: string, meta: MetaDto) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}
