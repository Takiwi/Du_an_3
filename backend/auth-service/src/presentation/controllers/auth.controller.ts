import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUseCase } from '@application/useCases/register/register.usecase';
import { CreateUserDto } from '../dto/requests/createUser.dto';
import {
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
  ApiCommonErrors,
} from '@packages/api-docs';
import { AuthResponseDto } from '../dto/responses/authResponse.dto';
import { AuthMapper } from '../mappers/auth.mapper';
import { AppError } from '@packages/pattern';
import { Response } from 'express';
import { LogoutUseCase } from '@application/useCases/logout/logout.usecase';
import { RefreshTokenUseCase } from '@application/useCases/refreshToken/refreshToken.usecase';
import { ConfigService } from '@nestjs/config';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { LoginDto } from '../dto/requests/login.dto';
import { LoginUseCase } from '@application/useCases/login/login.usecase';
import { ChangePasswordUseCase } from '@application/useCases/changePassword/changePassword.usecase';
import { ChangePasswordDto } from '../dto/requests/changePassword.dto';
import {
  BaseJwtPayload,
  JwtAuthGuard,
} from '@presentation/guards/jwtAuth.guard';
import { ERROR_DEFINITIONS } from '@presentation/configs/error.config';
import { Public } from '@presentation/decorators/public.decorator';
import { RequestWithCookies } from '@presentation/types/requestCookie.type';
import { CurrentUser } from '@presentation/decorators/currentUser.decorator';

@ApiCommonErrors()
@UseGuards(JwtAuthGuard)
@Controller('auth/')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly configService: ConfigService,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {}

  @ApiSuccessResponse({
    status: 201,
    model: AuthResponseDto,
    message: 'User created successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'EMAIL_ALREADY_EXISTS',
    'INVALID_UUID',
    'USERNAME_INVALID_LENGTH',
    'USERNAME_INVALID_CHARS',
    'USERNAME_RESERVED',
    'INVALID_PASSWORD',
    'PASSWORD_FORMAT',
    'VALIDATION_ERROR',
  ])
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.registerUseCase.execute(createUserDto);

    if (result.isErr()) throw result.error;

    return AuthMapper.toResponseDto(
      result.value.account,
      result.value.username,
    );
  }

  @ApiSuccessResponse({
    status: 200,
    model: AuthResponseDto,
    message: 'Login successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'EMAIL_NOT_FOUND',
    'INVALID_UUID',
    'USER_BANNED',
    'TOO_MANY_ATTEMPTS',
    'VALIDATION_ERROR',
    'PASSWORD_DO_NOT_MATCH',
  ])
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(loginDto);

    if (result.isErr()) throw result.error;

    res.cookie('accessToken', result.value.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>('cookie.accessExpiresIn'),
    });

    res.cookie('refreshToken', result.value.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.getOrThrow<number>('cookie.refreshExpiresIn'),
      path: 'auth/',
    });

    return AuthMapper.toResponseDto(result.value.account);
  }

  @ApiSuccessResponse({
    status: 204,
    message: 'Logout successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, ['TOKEN_NOT_FOUND'])
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
    'INVALID_TOKEN',
    'INVALID_UUID',
    'USER_NOT_FOUND',
    'TOKEN_USED_DETECTED',
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
      maxAge: this.configService.getOrThrow<number>('cookie.accessExpiresIn'),
    });

    res.cookie('refreshToken', result.value.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: result.value.refreshTokenExpiresAt.getTime() - Date.now(),
      path: 'auth/',
    });
  }

  @ApiSuccessResponse({
    status: 200,
    model: AuthResponseDto,
    message: 'Change password successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'INVALID_UUID',
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
    'INVALID_PASSWORD',
    'PASSWORD_FORMAT',
    'SAME_CURRENT_PASSWORD',
  ])
  @Patch('change-password')
  async changePassword(
    @CurrentUser<BaseJwtPayload>() userReq: BaseJwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const result = await this.changePasswordUseCase.execute(
      userReq.sub,
      changePasswordDto.newPassword,
    );

    if (result.isErr()) throw result.error;

    return AuthMapper.toResponseDto(result.value);
  }
}
