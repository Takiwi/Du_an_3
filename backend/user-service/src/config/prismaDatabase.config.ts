import { registerAs } from '@nestjs/config';

export default registerAs('prismaDatabase', () => ({
  databaseUrl: process.env.DATABASE_URL,
}));
