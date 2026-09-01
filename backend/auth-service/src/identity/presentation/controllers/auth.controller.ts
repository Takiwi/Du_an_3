import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserUseCase } from '@auth/application/useCases/register/register.usecase';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import {
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
  ApiCommonErrors,
} from '@packages/api-docs';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { UserMapper } from '../mappers/user.mapper';
import { AppError } from '@packages/pattern';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { LoginOutput } from '@auth/application/useCases/login/login.contract';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { LogoutUseCase } from '@auth/application/useCases/logout/logout.usecase';
import { RequestWithCookies } from '../types/requestCookie.type';
import { RefreshTokenUseCase } from '@auth/application/useCases/refreshToken/refreshToken.usecase';
import { ERROR_DEFINITIONS } from '../configs/error.config';
import { ConfigService } from '@nestjs/config';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { Public } from '@shared/decorators/public.decorator';

@ApiCommonErrors()
@UseGuards(JwtAuthGuard)
@Controller('auth/')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly configService: ConfigService,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
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
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.registerUseCase.execute(createUserDto);

    if (user.isErr()) throw user.error;

    return UserMapper.toResponseDto(user.value);
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
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @CurrentUser<LoginOutput>() result: LoginOutput,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>('cookie.accessExpiresIn'), // 5 phút
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>('cookie.refreshExpiresIn'), // 7 ngày
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || !accessToken)
      throw new AppError('TOKEN_NOT_FOUND', 'Token is missing');

    const result = await this.logoutUseCase.execute(accessToken, refreshToken);

    if (result.isErr()) throw result.error;

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @ApiSuccessResponse({
    status: 201,
    message: 'Refresh token successfully exchanged',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'TOKEN_NOT_FOUND',
    'USER_NOT_FOUND',
    'TOKEN_USED',
  ])
  @Public()
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      throw new AppError('TOKEN_NOT_FOUND', 'Token is missing');

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    if (result.isErr()) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      throw result.error;
    }

    res.cookie('accessToken', result.value.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>('cookie.accessExpiresIn'), // 5 phút
    });

    res.cookie('refreshToken', result.value.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: result.value.refreshTokenExpiresAt.getTime() - Date.now(), // thời gian hết hạn chính xác từ lúc login
      path: 'auth/',
    });
  }
}
