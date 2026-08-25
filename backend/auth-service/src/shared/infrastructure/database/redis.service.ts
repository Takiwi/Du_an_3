import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILogger, LOGGER_TOKEN } from '@packages/core/logging/ILogger.post';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(
    config: ConfigService,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {
    super({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    await this.connect();
    this.logger.info('Successfully connected to auth-redis');
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
