import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from '@packages/logging';
import { randomUUID } from 'node:crypto';
import { USER_PROFILE_REPOSITORY_TOKEN } from './domain/repositories/IUserProfile.repository';
import { UserProfileRepository } from './infrastructure/repositories/userProfile.repository';
import { GetProfileUseCase } from './application/useCases/getProfile/getProfile.usecase';
import { UpdateProfileUseCase } from './application/useCases/updateProfile/updateProfile.usecase';
import { CreateProfileUseCase } from './application/useCases/createProfile/createProfile.usecase';
import { UserController } from './presentation/controllers/user.controller';
import { PrismaService } from './infrastructure/database/prisma.service';
import { RedisService } from './infrastructure/database/redis.service';
import { RabbitMQModule } from './modules/rabbitmq.module';
import appConfig from './config/app.config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import redisDatabaseConfig from './config/redisDatabase.config';
import { ID_GENERATOR_TOKEN } from './application/ports/IdGenerator.port';
import { UserGRpcController } from './presentation/controllers/gRpc.controller';
import { DeleteProfileUseCase } from '@application/useCases/deleteProfile/deleteProfile.usecase';
import jwksConfig from './config/jwks.config';
import jwtConfig from './config/jwt.config';
import { UserExceptionFilter } from './presentation/filters/userExceptions.filter';
import { APP_FILTER } from '@nestjs/core/constants';
import { ClsModule } from '@packages/request-context';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        prismaDatabaseConfig,
        redisDatabaseConfig,
        jwksConfig,
        jwtConfig,
      ],
    }),
    AppLoggerModule.forRoot('user-service'),
    RabbitMQModule,
    ClsModule,
  ],
  controllers: [UserController, UserGRpcController],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY_TOKEN,
      useClass: UserProfileRepository,
    },
    {
      provide: ID_GENERATOR_TOKEN,
      useValue: { generate: () => randomUUID() },
    },
    {
      provide: APP_FILTER,
      useClass: UserExceptionFilter,
    },
    RedisService,
    PrismaService,
    DeleteProfileUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    CreateProfileUseCase,
  ],
  exports: [GetProfileUseCase],
})
export class AppModule {}
