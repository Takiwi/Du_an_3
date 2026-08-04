import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';
export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: true })
  isOperational: boolean;

  @ApiProperty({ example: 'ERROR_CODE' })
  code: string;

  @ApiProperty({ example: 'Thất bại' })
  message: string;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  constructor(
    isOperational: boolean,
    code: string,
    message: string,
    meta: MetaDto,
  ) {
    this.success = false;
    this.isOperational = isOperational;
    this.code = code;
    this.message = message;
    this.meta = meta;
  }
}
