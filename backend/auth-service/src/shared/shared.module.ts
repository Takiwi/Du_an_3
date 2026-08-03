import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { FormatResponse } from './presentation/interceptors/formatResponse.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponse,
    },
  ],
  exports: [PrismaService],
})
export class SharedModule {}
