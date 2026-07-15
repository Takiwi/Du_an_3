import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExistsException } from 'src/identity/domain/exceptions/AuthException';
import * as userResponseInterface from 'src/identity/domain/repositories/userResponse.interface';
import { CreateUserDto } from 'src/identity/presentation/dtos/createUser.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(userResponseInterface.USER_REPOSITORY_TOKEN)
    private readonly userRepository: userResponseInterface.IUserRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findById(dto.id);

    if (existingUser) throw new UserAlreadyExistsException(dto.email);

    return this.userRepository.insertUser(dto);
  }
}
