import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: ILogger) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`; // ép handshake thật sự
      this.logger.info(`Successfully connected to auth-postgreSQl`);
    } catch (error) {
      this.logger.error('Connection to PostgreSQL failed');
      throw error; // để Nest fail-fast, không cho app start với DB chết
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
