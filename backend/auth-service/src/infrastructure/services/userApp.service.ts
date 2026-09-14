import { IUserFacade, UserProfile } from '@application/ports/IUserFacade.port';
import { mapGRpcError } from '@infrastructure/mappers/gRPCError.mapper';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { firstValueFrom, Observable } from 'rxjs';

interface UserServiceClient {
  createUserProfile(input: {
    username: string;
    email: string;
  }): Observable<UserProfile>;

  deleteUserProfile(input: { userId: string }): Observable<unknown>;
}

@Injectable()
export class UserAppService implements IUserFacade, OnModuleInit {
  private client!: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private grpcClient: ClientGrpc) {}

  async deleteUserProfile(userId: string): Promise<Result<void, AppError>> {
    try {
      await firstValueFrom(this.client.deleteUserProfile({ userId }));
      return ok(undefined);
    } catch (error) {
      return err(mapGRpcError(error));
    }
  }

  async createUserProfile(
    username: string,
    email: string,
  ): Promise<Result<UserProfile, AppError>> {
    try {
      const result = await firstValueFrom(
        this.client.createUserProfile({ username, email }),
      );

      return ok(result);
    } catch (error) {
      return err(mapGRpcError(error));
    }
  }

  onModuleInit() {
    this.client = this.grpcClient.getService<UserServiceClient>('UserService');
  }
}
