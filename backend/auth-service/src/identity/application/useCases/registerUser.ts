import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from '../errors/application.error';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/repositories/IUser.repository';
import { CreateUserDto } from '../dtos/createUser.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) throw new UserAlreadyExistsException(dto.email);

    return this.userRepository.insertUser(dto);
  }
}
