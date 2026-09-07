import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  ttlCache: parseInt(process.env.TTL_CACHE_REDIS ?? '3600', 10),
}));
