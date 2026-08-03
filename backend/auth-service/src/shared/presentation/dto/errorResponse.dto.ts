import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto<T> {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: true })
  isOperational: boolean;

  @ApiProperty({
    example: { code: 'USER_NOT_FOUND', message: 'User not found', details: [] },
  })
  error: {
    code: string;
    message: string;
    details: T;
  };

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  timestamp: string;

  constructor(
    errorCode: string,
    details: T,
    message: string,
    isOperational: boolean = true,
  ) {
    this.success = false;
    this.isOperational = isOperational;
    this.error = {
      code: errorCode,
      message,
      details,
    };
    this.timestamp = new Date().toISOString();
  }
}
