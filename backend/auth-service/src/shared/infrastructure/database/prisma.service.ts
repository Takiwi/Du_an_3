import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`; // ép handshake thật sự
      console.log(`Kết nối PostgreSQL thành công!`);
    } catch (error) {
      console.error('Không thể kết nối PostgreSQL:', error);
      throw error; // để Nest fail-fast, không cho app start với DB chết
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
