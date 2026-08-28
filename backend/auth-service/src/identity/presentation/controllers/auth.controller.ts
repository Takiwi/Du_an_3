import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from '@auth/application/useCases/register/register.usecase';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import {
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
  ApiCommonErrors,
} from '@packages/api-docs';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { unwrapResult, AppError } from '@packages/pattern';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { LoginOutput } from '@auth/application/useCases/login/login.contract';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { LogoutUseCase } from '@auth/application/useCases/logout/logout.usecase';
import { RequestWithCookies } from '../types/requestCookie.type';
import { RefreshTokenUseCase } from '@auth/application/useCases/refreshToken/refreshToken.usecase';
import { ERROR_DEFINITIONS } from '../configs/error.config';

@ApiCommonErrors()
@Controller('auth/')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @ApiSuccessResponse({
    status: 201,
    model: UserResponseDto,
    message: 'User created successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'EMAIL_ALREADY_EXISTS',
    'VALIDATION_ERROR',
  ])
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = unwrapResult(
      await this.registerUseCase.execute(createUserDto),
    );

    return UserMapper.toResponseDto(user);
  }

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Login successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'EMAIL_NOT_FOUND',
    'VALIDATION_ERROR',
    'PASSWORD_DO_NOT_MATCH',
  ])
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser<LoginOutput>() result: LoginOutput,
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
      path: 'auth/',
    });

    return UserMapper.toResponseDto(result.user);
  }

  @ApiSuccessResponse({
    status: 204,
    message: 'Logout successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'TOKEN_NOT_FOUND',
    'USER_NOT_FOUND',
  ])
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      throw new AppError('TOKEN_NOT_FOUND', 'Token is missing');

    unwrapResult(await this.logoutUseCase.execute(refreshToken));

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @ApiSuccessResponse({
    status: 204,
    message: 'Refresh token successfully exchanged',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'TOKEN_NOT_FOUND',
    'USER_NOT_FOUND',
    'TOKEN_USED',
  ])
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      throw new AppError('TOKEN_NOT_FOUND', 'Token is missing');

    const result = unwrapResult(
      await this.refreshTokenUseCase.execute(refreshToken),
    );

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
      path: 'auth/',
    });
  }
}
