import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from '../errors/application.error';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUser.repository';
import { CreateUserInput } from '../contracts/createUser.contract';
import {
  IPasswordHasher,
  PASSWORD_HASHER_TOKEN,
} from '../ports/IPasswordHasher.port';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: CreateUserInput) {
    // Check email
    const existingUser = await this.userRepository.findUserByEmail(dto.email);

    if (existingUser) throw new UserAlreadyExistsException(dto.email);

    // hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // insert user
    return this.userRepository.insertUser({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });
  }
}
