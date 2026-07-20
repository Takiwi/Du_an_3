import { CreateUserDto } from 'src/identity/application/dtos/createUser.dto';
import { User } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = 'IUserRepository';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  insertUser(dto: CreateUserDto): Promise<User | null>;
}
