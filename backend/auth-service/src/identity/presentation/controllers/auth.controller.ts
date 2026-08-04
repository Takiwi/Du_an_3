import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/useCases/registerUser';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import { ApiSuccessResponse } from '../../../shared/decorators/apiSuccessResponse.decorator';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ResponseMessage } from '../../../shared/decorators/responseMessage.decorator';
import { ApiErrorResponse } from '../../../shared/decorators/apiErrorResponse.decorator';
import { ApplicationErrorCode } from '../../application/errors/application.error';
import { ApiCommonErrors } from '../../../shared/decorators/apiCommonErrors.decorator';

@ApiCommonErrors()
@Controller('auth/')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @ApiSuccessResponse(201, UserResponseDto)
  @ApiErrorResponse(ApplicationErrorCode.EMAIL_ALREADY_EXISTS, {
    description: 'Email already exists',
  })
  @ResponseMessage('User created successfully')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registerUseCase.execute(createUserDto);

    return UserMapper.toResponseDto(result);
  }
}
