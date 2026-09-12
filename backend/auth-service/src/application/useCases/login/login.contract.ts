export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accountId: string;
  accessToken: string;
  refreshToken: string;
}
