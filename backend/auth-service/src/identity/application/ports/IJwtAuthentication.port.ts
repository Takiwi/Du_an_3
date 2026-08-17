export const JWT_AUTHENTICATION_TOKEN = 'IJwtAuthentication';

export interface JwtPayload {
  sub: string;
  email?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtAuthentication {
  generateTokenPair(payload: JwtPayload): Promise<TokenPair>;

  verifyToken(token: string): Promise<JwtPayload>;
}
