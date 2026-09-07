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
}

@Injectable()
export class UserAppService implements IUserFacade, OnModuleInit {
  private client!: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private grpcClient: ClientGrpc) {}

  async createUserProfile(
    username: string,
    email: string,
  ): Promise<UserProfile> {
    const result = await firstValueFrom(
      this.client.createUserProfile({ username, email }).pipe(
        catchError((err) => {
          console.log(`Log error :::::::::::::::::::`);
          console.error(err);
          return throwError(() => mapGRpcError(err));
        }),
      ),
    );

    console.log(`TEST::::::${result.email}`);

    return result;
  }

  onModuleInit() {
    this.client = this.grpcClient.getService<UserServiceClient>('UserService');
  }
}
