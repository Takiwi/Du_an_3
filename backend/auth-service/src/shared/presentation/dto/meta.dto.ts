import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  requestId: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  timestamp: string;

  constructor(requestId: string, timestamp: string) {
    this.requestId = requestId;
    this.timestamp = timestamp;
  }
}
