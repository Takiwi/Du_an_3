import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserSchema,
} from '../../application/dtos/createUser.dto';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';

@Controller('auth/')
export class IdentityController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.registerUseCase.execute(createUserDto);
  }
}
