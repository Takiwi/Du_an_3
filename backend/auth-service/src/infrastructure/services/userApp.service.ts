import { IUserFacade, UserProfile } from '@application/ports/IUserFacade.port';
import { mapGRpcError } from '@infrastructure/mappers/gRPCError.mapper';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';

interface UserServiceClient {
  createUserProfile(input: {
    username: string;
    email: string;
  }): Observable<UserProfile>;

  deleteUserProfile(userId: string): Observable<void>;
}

@Injectable()
export class UserAppService implements IUserFacade, OnModuleInit {
  private client!: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private grpcClient: ClientGrpc) {}

  async deleteUserProfile(userId: string): Promise<void> {
    const result = await firstValueFrom(this.client.deleteUserProfile(userId));

    return result;
  }

  async createUserProfile(
    username: string,
    email: string,
  ): Promise<UserProfile> {
    const result = await firstValueFrom(
      this.client.createUserProfile({ username, email }).pipe(
        catchError((err) => {
          return throwError(() => mapGRpcError(err));
        }),
      ),
    );

    return result;
  }

  onModuleInit() {
    this.client = this.grpcClient.getService<UserServiceClient>('UserService');
  }
}
