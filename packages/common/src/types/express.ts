declare global {
  namespace Express {
    interface User {
      sub: string;
      roles: string[];
      permissions: string[];
    }

    interface Request {
      user?: User;
      cookies: {
        accessToken?: string;
        refreshToken?: string;
      };
    }
  }
}

export {};
