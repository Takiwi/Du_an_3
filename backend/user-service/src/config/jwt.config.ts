import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  privatekey: process.env.JWT_PRIVATE_KEY,
  refreshTokenExpiresIn: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRED_IN ?? '604800',
    10,
  ),
  publicKey: process.env.JWT_PUBLIC_KEY,
  accessTokenExpiresIn: parseInt(
    process.env.JWT_ACCESS_TOKEN_EXPIRED_IN ?? '300',
    10,
  ),
}));
