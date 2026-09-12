import { IUserFacade, UserProfile } from '@application/ports/IUserFacade.port';
import { mapGRpcError } from '@infrastructure/mappers/gRPCError.mapper';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppError } from '@packages/pattern';
import { err, Result } from 'neverthrow';
import { firstValueFrom, Observable } from 'rxjs';

interface UserServiceClient {
  createUserProfile(input: {
    username: string;
    email: string;
  }): Observable<Result<UserProfile, AppError>>;

  deleteUserProfile(userId: string): Observable<Result<void, AppError>>;
}

@Injectable()
export class UserAppService implements IUserFacade, OnModuleInit {
  private client!: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private grpcClient: ClientGrpc) {}

  async deleteUserProfile(userId: string): Promise<Result<void, AppError>> {
    const result = await firstValueFrom(this.client.deleteUserProfile(userId));

    if (result.isErr()) return result;

    return result;
  }

  async createUserProfile(
    username: string,
    email: string,
  ): Promise<Result<UserProfile, AppError>> {
    try {
      const result = await firstValueFrom(
        this.client.createUserProfile({ username, email }),
      );

      if (result.isErr()) return result;

      return result;
    } catch (error) {
      return err(mapGRpcError(error));
    }
  }

  onModuleInit() {
    this.client = this.grpcClient.getService<UserServiceClient>('UserService');
  }
}
