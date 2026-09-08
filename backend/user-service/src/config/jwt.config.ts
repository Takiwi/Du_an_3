import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwtIssuer: process.env.JWT_ISSUER,
}));
