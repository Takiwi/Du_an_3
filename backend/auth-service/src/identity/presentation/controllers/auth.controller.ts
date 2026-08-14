import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import { LogoutUseCase } from '../../application/useCases/logout.usecase';
import { RequestWithCookies } from '../../infrastructure/auth/jwt.strategy';
import { AppError } from '@packages/core/errors/app.error';

@ApiCommonErrors()
@Controller('auth/')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @ApiSuccessResponse({
    status: 201,
    model: UserResponseDto,
    message: 'User created successfully',
  })
  @ApplyApiErrorsResponse(['EMAIL_ALREADY_EXISTS', 'VALIDATION_ERROR'])
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

    res.cookie('sessionId', result.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return UserMapper.toResponseDto(result.user);
  }

  @ApiSuccessResponse({
    status: 204,
    message: 'Logout successfully',
  })
  @ApplyApiErrorsResponse([
    'SESSION_ID_NOT_FOUND',
    'TOKEN_NOT_FOUND',
    'USER_NOT_FOUND',
  ])
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId)
      throw new AppError('SESSION_ID_NOT_FOUND', 'Session id is missing');

    await this.logoutUseCase.execute(sessionId);

    res.clearCookie('accessToken');
    res.clearCookie('sessionId');
  }

  @ApiSuccessResponse({
    status: 204,
    message: 'Refresh token successfully exchanged',
  })
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithCookies,
  ) {
    const sessionId = req.cookies?.sessionId;
  }
}
