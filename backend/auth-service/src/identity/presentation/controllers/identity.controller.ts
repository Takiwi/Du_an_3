import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/createUser.dto';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';

@Controller('auth/')
export class IdentityController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUseCase.execute(createUserDto);
  }
}
