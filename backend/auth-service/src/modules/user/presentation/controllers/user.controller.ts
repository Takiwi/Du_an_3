import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiCommonErrors,
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
} from '@packages/api-docs';
import { UserProfileResponseDto } from '../dto/responses/userProfileResponse.dto';
import { JwtAuthGuard, BaseJwtPayload } from '@shared/guards/jwtAuth.guard';
import { CurrentUser } from '@shared/decorators/currentUser.decorator';
import { GetProfileUseCase } from '../../application/useCases/getProfile/getProfile.usecase';
import { UpdateProfileUseCase } from '../../application/useCases/updateProfile/updateProfile.usecase';
import { UserProfileMapper } from '../mappers/userProfile.mapper';
import { ERROR_DEFINITIONS } from '@shared/configs/error.config';
import { UpdateUserDto } from '../dto/requests/updateUser.dto';

@ApiCommonErrors()
@UseGuards(JwtAuthGuard)
@Controller('user/')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @ApiSuccessResponse({
    status: 200,
    model: UserProfileResponseDto,
    message: 'Get user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'INVALID_UUID',
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
  ])
  @Get('me')
  async userInfo(@CurrentUser<BaseJwtPayload>() userReq: BaseJwtPayload) {
    const result = await this.getProfileUseCase.execute(userReq.sub);

    if (result.isErr()) throw result.error;

    return UserProfileMapper.toResponseDto(result.value);
  }

  @ApiSuccessResponse({
    status: 200,
    model: UserProfileResponseDto,
    message: 'Update user info successfully',
  })
  @ApplyApiErrorsResponse(ERROR_DEFINITIONS, [
    'INVALID_UUID',
    'USER_NOT_FOUND',
    'VALIDATION_TOKEN_FALSE',
    'USERNAME_INVALID_LENGTH',
    'USERNAME_INVALID_CHARS',
    'USERNAME_RESERVED',
    'USERNAME_CHANGE_COOLDOWN',
    'USERNAME_ALREADY_EXISTS',
  ])
  @Patch('update')
  async update(
    @CurrentUser<BaseJwtPayload>() userReq: BaseJwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.updateProfileUseCase.execute({
      id: userReq.sub,
      ...updateUserDto,
    });

    if (result.isErr()) throw result.error;

    return UserProfileMapper.toResponseDto(result.value);
  }
}
