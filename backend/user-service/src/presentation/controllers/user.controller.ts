import {
  Body,
  Controller,
  Get,
  Patch,
  Inject,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCommonErrors,
  ApiSuccessResponse,
  ApplyApiErrorsResponse,
} from '@packages/api-docs';
import { UserProfileResponseDto } from '../dto/responses/userProfileResponse.dto';
import { GetProfileUseCase } from '@application/useCases/getProfile/getProfile.usecase';
import { UpdateProfileUseCase } from '@application/useCases/updateProfile/updateProfile.usecase';
import { UserProfileMapper } from '../mappers/userProfile.mapper';
import { UpdateUserDto } from '../dto/requests/updateUser.dto';
import { ERROR_DEFINITIONS } from '../configs/error.config';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateProfileDto } from '../dto/requests/createProfile.dto';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CreateProfileUseCase } from '@application/useCases/createProfile/createProfile.usecase';
import { Public } from '../decorators/public.decorator';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';

@ApiCommonErrors()
@UseGuards(JwtAuthGuard)
@Controller('user/')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly createProfileUseCase: CreateProfileUseCase,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {}

  // ----------------------------------------------------
  // 1. DÀNH CHO CÁC SERVICE KHÁC GỌI QUA REST API
  // ----------------------------------------------------

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
  async userInfo(@CurrentUser('sub') userReq: string) {
    const result = await this.getProfileUseCase.execute(userReq);

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
    @CurrentUser('sub') userReq: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.updateProfileUseCase.execute({
      id: userReq,
      ...updateUserDto,
    });

    if (result.isErr()) throw result.error;

    return UserProfileMapper.toResponseDto(result.value);
  }

  // ----------------------------------------------------
  // 2. DÀNH CHO CÁC SERVICE KHÁC GỌI QUA gRPC
  // ----------------------------------------------------

  @Public()
  @GrpcMethod('UserService', 'createUserProfile')
  async create(@Payload(new ValidationPipe()) createUserDto: CreateProfileDto) {
    this.logger.debug(`Hello::::::::${createUserDto.email}`);
    try {
      const result = await this.createProfileUseCase.execute(createUserDto);

      if (result.isErr()) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: JSON.stringify({
            appErrorCode: result.error.code,
            message: result.error.internalMessage,
          }),
        });
      }

      return result.value;
    } catch (error) {
      this.logger.debug('Hello2');
      console.error(error);
    }
  }
}
