export const JWT_AUTHENTICATION_TOKEN = 'IJwtAuthentication';

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface IJwtAuthentication {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(userId: string): string;
}
