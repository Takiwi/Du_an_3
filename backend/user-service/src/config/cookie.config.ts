import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => ({
  accessExpiresIn: process.env.COOKIE_ACCESS_TOKEN_EXPIRED_IN,
  refreshExpiresIn: process.env.COOKIE_REFRESH_TOKEN_EXPIRED_IN,
}));
