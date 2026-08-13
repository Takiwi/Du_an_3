import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
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
import { LoginOutput } from '../../application/contracts/login.contract';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

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
  login(
    @CurrentUser() result: LoginOutput,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/auth/refresh', // giới hạn path nếu muốn refresh token chỉ gửi tới endpoint refresh
    });

    return UserMapper.toResponseDto(result.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    console.log(`Hello from logout`);
  }
}
