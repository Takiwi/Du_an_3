import { User } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = 'IUserRepository';

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  existsByEmail(email: string): Promise<boolean>;

  insertUser(user: User): Promise<void>;
}
