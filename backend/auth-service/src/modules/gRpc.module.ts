import { USER_FACADE_TOKEN } from '@application/ports/IUserFacade.port';
import { UserAppService } from '@infrastructure/services/userApp.service';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PACKAGES, PROTO_PATHS } from '@packages/grpc-contracts';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: PROTO_PACKAGES.USER,
          protoPath: PROTO_PATHS.USER,
          url: 'localhost:5002',
        },
      },
    ]),
  ],
  providers: [{ provide: USER_FACADE_TOKEN, useClass: UserAppService }],
  exports: [USER_FACADE_TOKEN],
})
export class GRpcModule {}
