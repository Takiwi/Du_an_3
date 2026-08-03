import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { CreateUserDto } from '../dtos/requests/createUser.dto';

@Controller('auth/')
export class IdentityController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUseCase.execute(createUserDto);
  }
}
