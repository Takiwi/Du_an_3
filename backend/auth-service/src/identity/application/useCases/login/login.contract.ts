import { User } from '@auth/domain/entities/user/user.entity';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  accessToken: string;
  refreshToken: string;
}
