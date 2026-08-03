import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import { ApiStanderResponse } from '../../../shared/decorators/apiStandardResponse.decorator';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ResponseMessage } from '../../../shared/decorators/responseMessage.decorator';

@Controller('auth/')
export class IdentityController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @ApiStanderResponse(UserResponseDto)
  @ResponseMessage('User created successfully')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registerUseCase.execute(createUserDto);

    return UserMapper.toResponseDto(result);
  }
}
