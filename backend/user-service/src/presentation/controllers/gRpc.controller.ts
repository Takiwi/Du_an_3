import { Controller, Inject, UseFilters, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { CreateProfileDto } from '../dto/requests/createProfile.dto';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { CreateProfileUseCase } from '@application/useCases/createProfile/createProfile.usecase';
import { status } from '@grpc/grpc-js';
import { DeleteProfileUseCase } from '@application/useCases/deleteProfile/deleteProfile.usecase';
import { UserProfileMapper } from '../mappers/userProfile.mapper';
import { AppError } from '@packages/pattern';
import { GrpcExceptionFilter } from '../filters/gRpcException.filter';

@Controller()
@UseFilters(GrpcExceptionFilter)
export class UserGRpcController {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly deleteProfileUseCase: DeleteProfileUseCase,
  ) {}

  @GrpcMethod('UserService', 'createUserProfile')
  async create(@Payload(new ValidationPipe()) createUserDto: CreateProfileDto) {
    try {
      const result = await this.createProfileUseCase.execute(createUserDto);

      if (result.isErr()) {
        throw result.error;
      }

      return UserProfileMapper.toResponseDto(result.value);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[gRPC error]', err);

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  @GrpcMethod('UserService', 'deleteUserProfile')
  async delete(@Payload() request: { userId: string }) {
    try {
      const result = await this.deleteProfileUseCase.execute(request.userId);

      if (result.isErr()) {
        throw result.error;
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[gRPC error]', err);

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }
}
