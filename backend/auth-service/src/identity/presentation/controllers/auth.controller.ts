import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import { ApiSuccessResponse } from '../../../shared/decorators/apiSuccessResponse.decorator';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ApiCommonErrors } from '../../../shared/decorators/apiCommonErrors.decorator';
import { ApplyApiErrorsResponse } from '../../../shared/decorators/applyApiErrorsResponse.decorator';

@ApiCommonErrors()
@Controller('auth/')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @ApiSuccessResponse(201, UserResponseDto, 'User created successfully')
  @ApplyApiErrorsResponse(['EMAIL_ALREADY_EXISTS', 'VALIDATION_ERROR'])
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registerUseCase.execute(createUserDto);

    return UserMapper.toResponseDto(result);
  }
}
