import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiCommonErrors,
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
} from '@packages/api-docs';
import { UserResponseDto } from '../dto/responses/userResponse.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { JwtPayload } from '@auth/application/ports/IJwtAuthentication.port';
import { MeUseCase } from '@auth/application/useCases/me/me.usecase';
import { UserMapper } from '../mappers/user.mapper';
import { ERROR_DEFINITIONS } from '../configs/error.config';
import { UpdateUserDto } from '../dto/requests/updateUser.dto';
import { UpdateUserUserCase } from '@auth/application/useCases/updateUser/updateUser.usecase';
import { UpdatePasswordUserCase } from '@auth/application/updatePassword/updatePassword.usecase';
import { ChangePasswordDto } from '../dto/requests/changePassword.dto';

@ApiCommonErrors()
@Controller('user/')
export class UserController {
  constructor(
    private readonly meUseCase: MeUseCase,
    private readonly updateUserUseCase: UpdateUserUserCase,
    private readonly changePasswordUseCase: UpdatePasswordUserCase,
  ) {}

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Get user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
  ])
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async userInfo(@CurrentUser<JwtPayload>() userReq: JwtPayload) {
    const result = await this.meUseCase.execute(userReq.sub);

    if (result.isErr()) throw result.error;

    return UserMapper.toResponseDto(result.value);
  }

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Update user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
    'USERNAME_CHANGE_COOLDOWN',
  ])
  @UseGuards(JwtAuthGuard)
  @Patch('update/')
  async update(
    @CurrentUser<JwtPayload>() userReq: JwtPayload,
    @Body() updateUser: UpdateUserDto,
  ) {
    const result = await this.updateUserUseCase.execute({
      id: userReq.sub,
      ...updateUser,
    });

    if (result.isErr()) throw result.error;

    return UserMapper.toResponseDto(result.value);
  }

  @ApiSuccessResponse({
    status: 200,
    model: UserResponseDto,
    message: 'Update user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
  ])
  @UseGuards(JwtAuthGuard)
  @Patch('changePassword/')
  async changePassword(
    @CurrentUser<JwtPayload>() userReq: JwtPayload,
    @Body() newPassword: ChangePasswordDto,
  ) {
    const result = await this.changePasswordUseCase.execute(
      userReq.sub,
      newPassword.newPassword,
    );

    if (result.isErr()) throw result.error;

    return UserMapper.toResponseDto(result.value);
  }
}
