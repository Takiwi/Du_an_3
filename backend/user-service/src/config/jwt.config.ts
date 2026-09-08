import { registerAs } from '@nestjs/config';

export default registerAs('jwks', () => ({
  url: process.env.JWKS_URL,
}));
