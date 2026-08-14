import { User } from '../../domain/entities/user.entity';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  accessToken: string;
  sessionId: string;
}
