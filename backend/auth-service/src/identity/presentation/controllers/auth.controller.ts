import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/useCases/registerUser.usecase';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import { ApiSuccessResponse } from '../../../shared/decorators/apiSuccessResponse.decorator';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ApiCommonErrors } from '../../../shared/decorators/apiCommonErrors.decorator';
import { ApplyApiErrorsResponse } from '../../../shared/decorators/applyApiErrorsResponse.decorator';
import { unwrapResult } from '@packages/contracts/helpers/resultPattern';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { CurrentUser } from '../../../shared/decorators/currentUser.decorator';
import { User } from '../../domain/entities/user.entity';
import { LoginDto } from '../dto/requests/login.dto';

@ApiCommonErrors()
@Controller('auth/')
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @ApiSuccessResponse(201, UserResponseDto, 'User created successfully')
  @ApplyApiErrorsResponse(['EMAIL_ALREADY_EXISTS', 'VALIDATION_ERROR'])
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = unwrapResult(
      await this.registerUseCase.execute(createUserDto),
    );

    return UserMapper.toResponseDto(user);
  }

  @ApiSuccessResponse(200, UserResponseDto, 'Login successfully')
  @ApplyApiErrorsResponse([
    'EMAIL_NOT_FOUND',
    'VALIDATION_ERROR',
    'PASSWORD_DO_NOT_MATCH',
  ])
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto, @CurrentUser() user: User) {
    return UserMapper.toResponseDto(user);
  }
}
