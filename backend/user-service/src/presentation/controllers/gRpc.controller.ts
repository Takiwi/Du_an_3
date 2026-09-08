import { Controller, Inject, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { CreateProfileDto } from '../dto/requests/createProfile.dto';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { CreateProfileUseCase } from '@application/useCases/createProfile/createProfile.usecase';
import { status } from '@grpc/grpc-js';
import { DeleteProfileUseCase } from '@application/useCases/deleteProfile/deleteProfile.usecase';

@Controller()
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
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[User service error]', err);

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  @GrpcMethod('UserService', 'deleteUserProfile')
  async delete(@Payload() userId: string) {
    try {
      await this.deleteProfileUseCase.execute(userId);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[User service error]', err);

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }
}
