import { User } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = 'IUserRepository';

type CreateUserProps = Omit<User, 'id' | 'status' | 'role'>;

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  insertUser(data: CreateUserProps): Promise<User | null>;
}
