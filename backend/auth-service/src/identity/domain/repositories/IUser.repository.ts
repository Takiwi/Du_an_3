import { User } from '../entities/user/user.entity';
import { AccountStatus } from '../value-objects/accountStatus.vo';
import { Password } from '../value-objects/password.vo';
import { UserId } from '../value-objects/userId.vo';

export const USER_REPOSITORY_TOKEN = 'IUserRepository';

export interface IUserRepository {
  findUserById(id: UserId): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;

  existsByEmail(email: string): Promise<boolean>;

  insertUser(user: User): Promise<void>;

  updateStatusById(id: UserId, status: AccountStatus): Promise<User>;
  updatePasswordById(id: UserId, password: Password): Promise<User>;
  updateUsernameById(
    id: UserId,
    updates: { username?: string; lastUsernameChangedAt?: Date },
  ): Promise<User>;
}
