import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(
    config: ConfigService,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {
    super({
      host: config.getOrThrow<string>('redis.host'),
      port: config.getOrThrow<number>('redis.port'),
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
