import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { FormatResponse } from './presentation/interceptors/formatResponse.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisService } from './infrastructure/database/redis.service';

@Module({
  providers: [
    PrismaService,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponse,
    },
  ],
  exports: [PrismaService, RedisService],
})
export class SharedModule {}
